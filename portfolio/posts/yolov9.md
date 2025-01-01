---
layout: post
title: "Understanding the YOLOv9 Paper"
description: My notes on the YOLOv9 paper.
categories: research
tags: [notes, vision, papers, computer science]
toc:
    sidebar: left
---
This is another paper in the YOLO iteration. I like vision papers a lot and these are my notes from my reading of the paper.

Original paper [link](https://arxiv.org/abs/2402.13616).


# What exactly is the problem with current models?

 Object detection models can be simplified as learning the most important features in a training set which can allow it to predict the location (bounding box) or segmentation map of a given test object. Ideally, we want such models to be robustly generalized - an object detection world model which can one shot any test object in any scenario as long as it has seen objects of a similar class. There has been a push towards achieving this ideal but not without roadblocks in convergence, which the paper focuses a lot on. 
 
 The authors argue that in part a lot of poor/slow convergence is caused by the model not being able to strike the perfect balance between compression (learning the least amount of important features to get the job done) and relevance (which features are actually the most relevant?). This is essentially what the information bottleneck problem is.


# What's an information bottleneck?
An information bottleneck is when we compress high dimensional input data into lower dimension features by retaining the most important features to reduce computational complexity for training and inference, but at the same time it leads to data loss because we have to trim some features. 

This is what almost every modern deep learning method does, and is essentially its goal. Deep learning is an inherent compression optimization problem. A model tries to learn the least amount of most important features by a priority basis - that is how we get feature maps and attention. The best model is the one which generalizes perfectly over a concept so as to require learn the least number of features possible while retaining enough information to achieve the best results.

It's hard to measure the ideal amount of information loss from information bottlenecks. The authors in the paper argue that the loss from information bottlenecks may still be non-negligible in many modern techniques because it is simply learning the wrong features and hence the wrong mapping between input and predictions.
<p align="center">
    <img src="/assets/img/infobottleneck1.png" alt="alt text" width="90%">
</p>

The information loss due to the bottleneck can be described by in terms of mutual information:

$$
    I(X,X) \ge I(X, f\theta(X) \ge I(X, g\phi(f\theta(X)))
$$

Here \\(I\\) is the mutual information. Mathematically, \\(MI(X;Y)\\) is defined  as:
    
$$
MI(X;Y) = ∑p(x,y) \log_2(\frac{p(x,y)}{p(x)p(y)})
$$

..where \\(p(x)\\) and \\(p(y)\\) are the marginal probability distributions of X and \\(Y\\), respectively, and \\(p(x,y)\\) is their joint probability distribution. Intuitively, MI measures how much knowing the value of X reduces uncertainty about Y, or conversely, how much knowing the value of Y reduces uncertainty about X. \\(f\\) and \\(g\\) are transformation functions with trainable parameters \\(\theta\\) and \\(\phi\\).

**What does this even mean?**

<p align="center">
    <img src="/assets/img/infobottleneck2.png" alt="alt text" width="90%">
</p>

1. This represents that as more neural transformations are applied, the more information is lost. As in, deeper layers mean more information loss since there's consecutive application of transformation functions (neurons).

2. This means a model with deeper layers retain lesser info about both the input and target. 
Hence it would naturally perform worse.

3. A model with larger number of parameters has much more parameters and can learn larger number of features (information) about the data. 
This is why width is important in deep networks than depth itself.

4. This increase in width can only increase the scope of learning more information by simply increasing the number of params, but the information loss per param is still the same (or, often increased because of more connections). 

# How do we get rid of this data loss?
The paper identifies 3 ways of dealing with data loss from information bottleneck.

1. **Reversibility**: Reversibility is a method where we can compute/reconstruct the activations of a hidden/intermediate layer \\(Y_N\\) from a subsequent layer \\(Y_{N+1}\\) during backpropagation. By eliminating the need to store intermediate activations, this approach significantly enhances memory efficiency, leading to more compact networks. However, reversible architectures often require additional layers, increasing computational complexity as a trade-off for reduced memory usage.

2. **Masked modeling**: Masked modeling improves feature extraction by training the model to predict missing (masked) features in the input data, using a reconstruction loss. This loss measures how effectively the model can reconstruct the original input from the predicted features. By learning stronger features, the model retains more information even after passing through bottleneck layers. However, conflicts may arise between the reconstruction loss and the task-specific loss, leading to suboptimal input-output mappings. 

3. **Deep supervision**: In deep supervision, intermediate layers receive guidance through auxiliary loss functions, in addition to the primary supervision signal from backpropagation. Prediction layers are added between hidden layers to compute auxiliary losses, which are then combined with the main loss (e.g., cross-entropy). This method strengthens feature learning in earlier layers, facilitating better gradient flow and mitigating vanishing gradients. It supports more stable training, improves multi-task learning, and enhances generalization. However, it can lead to error accumulation, where intermediate losses propagate inaccuracies into the overall loss function. Additionally, information lost in shallower layers cannot be recovered by deeper ones.

## Programmable Gradient Information

To solve the previous issues, YOLOv9 utilizes **Programmable Gradient Information** (PGI). PGI tries to solve the issues caused by information bottlenecks and gradient inefficiency by combining both deep supervision and reversible architectures. 

The motive of deep supervision in object detection, as I mentioned before, is to act as guidance for a model's layers to ensure they are learning the right features. A popular method of implementing deep supervision is through auxiliary branches. These are temporary branches which will act as checks for the hidden deep layers in a network by supervising them on the intermediate representation they produce. The auxiliary branch makes the intermediate layers perform predictions based on the representations they produce. This also has an added effect of breaking down the final learning objective into more manageable tasks. The final loss into a standard main loss (\\(L_{main}\\)) computed at the end of the network and auxiliary losses computed at the intermediate predictions in the auxiliary layers (\\(L_{aux}\\)). We can of course represent it as :

$$
\mathcal{L}_{total} = \mathcal{L}_{main} + \sum_{i} \lambda_i \mathcal{L}_{aux,i}
$$

Where \\(\lambda_i\\) is the weighing coefficient for each auxiliary loss. These auxiliary losses guide the intermediate layers to learn features more effectively, ensuring better representation across the network.

## PGI Architecture 
PGI definitely works well in concept, but adding more neurons to a model is not always the answer because it will lead to slower inference. The auxiliary layers will increase inference costs by 20% when added. However we don't have to work about that with the auxiliary layers because they are only present during the training phase to supervise intermediate layers. During inference, we "turn off" the auxiliary layers. Auxiliary layers also only aim to add new, important information that is missing in the intermediate representations. Hence, this concept will not underparameterize our model because we're not passing the entirety of original information from the image again, just the essential bits.

<p align="center">
    <img src="/assets/img/PGI.png" alt="alt text" width="70%">
</p>

### Observations in previous architectures
Authors found high performance in many models with reversible architectures. DynamicNet uses YoloV7 and merges it with CBNet architecture which has multi-level reversible branches with high parameter utilization. YoloV9 builds on DynamicNet architecture to design reversible branches on which it implements PGI.

- Deep supervision works by two methods:
    
    - Guiding intermediate layers by introducing auxiliary losses for each intermediate layer using prediction layers between hidden layers.
    
    - Guiding feature maps to directly have properties that are present in the target image using depth or segmentation loss.

Deep supervision is usually not fit for lightweight models because it can cause underparameterization in them. This means a model does not have enough learnable parameters relative to the complexity of the model it is trying to solve. If during deep supervision the given layer in the layer hierarchy does not have enough learnable parameters to calculate auxiliary loss, it can degrade the performance of that layer, and then this degraded output is fed to the next layer which may suffer from the same problem. Hence a cascading effect starts, leading to negative performance. However PGI can reprogram semantic information and allows lightweight models to benefit from this (how exactly semantic information helps, honestly idk - authors just shove that word in without an explanation on the why for this part).

# The Error Accumulation Problem (and Solving it)
Error accumulation in neural networks occurs when errors from intermediate layers propagate and compound as they flow through the network - causing all sorts of issues degraded performance, unstable training and is a major reason for poor generalization and convergence.

To understand error accumulation, let's consider how a neural network functions: each layer transforms its input, producing an output that becomes the input for the next layer. The final predictions rely heavily on the quality of these intermediate transformations. If early layers make slight errors in feature extraction, these errors are passed down the network, often amplified by subsequent layers. Over time, these compounding inaccuracies distort the final prediction.

For example, in an object detection task:

- Suppose the early convolutional layers fail to accurately identify edges and textures due to slight misrepresentations.

- As these incomplete features move through the network, the bounding box prediction layers receive noisy or irrelevant feature maps.

- The final predictions might place bounding boxes inaccurately or fail to recognize objects altogether.


If \\( h_i \\) represents the output of the \\( i \\)-th layer, and \\(\ \epsilon_i \\) the error at this layer. The output at the next layer can be written as:
$$
h_{i+1} = f(h_i) + \epsilon_i,
$$
where \\( f(\cdot) \\) is the transformation function. When \\( \epsilon_i \\) is propagated to the next layer, it may interact non-linearly with \\( f(\cdot) \\), compounding the error:

$$
\epsilon_{i+1} = g(f(h_i + \epsilon_i)) - g(f(h_i)),
$$

where \\( g(\cdot) \\) represents the next transformation. As this process repeats across layers, \\(\epsilon_{total}\\) grows, particularly in deeper networks, leading to distorted representations and predictions.

The effect of this problem does not stop here. Since it effects our error, it effects our gradient. And because of this backpropagation amplifies the original effect of error accumulation across the network - causing gradient degredation.

For instance, in a deep network, if the gradient of the loss function with respect to a weight in an earlier layer is denoted by:

$$
\frac{\partial \mathcal{L}}{\partial W_i} = \frac{\partial \mathcal{L}}{\partial h_N} \cdot \frac{\partial h_N}{\partial h_{N-1}} \cdot \ldots \cdot \frac{\partial h_{i+1}}{\partial W_i},
$$

where \\( N \\) is the number of layers, any instability (e.g., large or small derivatives) in intermediate layers amplifies inaccuracies, affecting weight updates. This leads to the phenomenon where earlier layers either "freeze" (due to negligible updates) or oscillate (due to erratic updates), compromising their ability to extract meaningful features.

## Error Accumulation through Auxiliary Layers

This problem is more than simply relevant for YOLOv9 because of its usage of deep supervision through auxiliary layers. Deep supervision, while a strategy to address such issues, can itself contribute to error accumulation if not implemented carefully. The aim of this method, as we discussed previously, is to guide intermediate layers to learn more meaningful representations. However, if the auxiliary losses are poorly designed or conflict with the primary task, they can introduce new errors. This leads to the model prioritizing learning features which do not align with the main task at all, achieving the opposing effect of what we originally wanted. 


## Solving Error Accumulation
Preventing error accumulation ideally is very straightforward - reduce the error wherever possible. As we discussed previously in the information bottleneck section, a major reason of poor predictions is information loss during data transformation between layers and learning features. Although the deep supervision (auxiliary) branch helps guide the main branch towards learning the right features, we still suffer from information loss in the auxiliary branch, the error from which gets added to the final error. 

Another important area where information loss occurs is where the actual gradients from intermediate predictions (which are supposed to act as guidance) are not successfully mapped by the main branch to the target object. To ensure this mapping of the auxiliary gradient information happens correctly, YOLOv9 contains a multi-level auxiliary information branch. This branch acts as an intermediate between the auxiliary branch and the main branch. It aggregates the auxiliary gradients and has the specific task to integrate these gradients into the main gradient flow by making predictions of its own.


# Reversible Functions : Why do we need them?
Reversible functions in YOLOv9 are primarily applied to enhance memory efficiency during training while maintaining model accuracy. They address the challenge of storing intermediate activations required for backpropagation. However the biggest advantage of reversible functions is the minimal information loss while reconstructing previous activations.

To understand reversible functions, let's consider a function \\(r_\psi(X)\\), which may have an inverse transformation \\(v_\zeta()\\). This means when we apply \\(v_\zeta()\\) on \\(r_\psi(X)\\), we get \\(X\\) back:

$$
    X = v_\zeta(r_\psi(X))
$$

where \\(\psi\\) and \\(\zeta\\) are parameters.

A reversible function results in a perfect recreation of the initial data \\(X\\), this means it has no information loss:

$$
    I(X,X) = I(X, r_\psi(X)) = I(X, v_\zeta(r_\psi(X))
$$

Hence the activations can be recomputed through reversible functions. This leads to better performance. This can be mathematically represented as :

$$
    X^{l+1} = X^l + f\theta ^{l+1}(X^l)
$$

This exact method was used in the PreAct ResNet model, where the equation above depicts the \\(l\\) th layer and a transformation function \\(f\\) is applied on the \\(l\\)-th layer. We can see that it is a reversible function as \\(X^{l+1}\\) can be obtained by explicitly passing \\(X^l\\) (Data from \\(l\\)-th layer) to the subsequent layers. This leads to good convergence but high complexity. Hence why PreAct ResNet must need high amount of layers to function well (susceptible to underparameterization).

We can pose the information bottleneck equation above as a mapping from input \\(X\\) to target \\(Y\\):

$$
    I(X,Y) \ge I(Y,X) \ge I(Y, f\theta(X) \ge \dots \ge I(Y, \hat Y)
$$ 

Because of underparameterization in the shallow layers, a lot of information can be lost in the first few layers itself during \\(I(Y,X)\\). If we lose information in the start, the succeeding transformation functions will have no way to recover the lost information. Hence the goal for getting reliable gradients is minimizing information loss while mapping \\(X\\) to \\(Y\\) as in \\(I(Y,X)\\) from \\(I(X,X)\\).

To mitigate the problems caused by solely utilizing reversible functions without making the model extremely beefy, we simply selectively utilize the reversible function property in combination with the auxiliary branch during training. These layers are placed in shallow layers where the bottleneck is more prominent, as well as in the auxiliary branch itself. 


For example, consider an intermediate activation \\( X^{l} \\) at layer \\( l \\). When transformed by a reversible function \\( r_\psi \\), it produces \\( X^{l+1} = X^l + f_\theta(X^l) \\), where \\( f_\theta \\) is the transformation applied. To reconstruct \\( X^l \\) during backpropagation, we compute:

$$
X^l = X^{l+1} - f_\theta(X^l),
$$

ensuring that the original data is retrievable. This framework avoids the explicit storage of \\( X^l \\), significantly reducing memory usage. However, this process becomes computationally expensive for all layers due to the repetitive evaluations of \\( f_\theta \\). 

This is where we try to see where exactly we can cut corners just enough while reconstructing our activations - by asking if it is necessary to reconstruct all activations at all? YOLOv9 does this by using an approximation function to reconstruct only the activations which are relevant and contribute importantly to the gradient flow. We can dynamically apply a mask \\(M\\) on the activations which we want to recompute. Then, we define the approximation function \\( v_\zeta \\) which reconstructs the masked input efficiently:

$$
X = v_\zeta(r_\psi(X) \cdot M),
$$

where \\( M \\) ensures that only the relevant activations contributing to the gradient flow are computed. This selective reconstruction reduces the computational load while maintaining the integrity of the gradients.

# Better feature extraction with GELAN
Deep models lose information during the progressive feature extraction process due to the information bottleneck principle, which we argued previously. This is caused due to repeated data (feature) transformations. If we find a method to learn and propagate gradients without the use of excessive transformations, it can potentially decrease model degradation from information loss usually incurred from the transformations. Turns out there does exist such a method, called Cross Stage Partial Networks or CSPNet. 

CSPNet is a foundational architecture built to improve gradient flow, reduce computational complexity and enhance feature extraction efficiency of deep networks. It originally was used to solve the issue of redundant gradient information and information loss in deep convolutional networks, which share a lot of similarities with YOLOv9. CSPNet does this by using a split-transform-merge architecture:

<p align="center">
    <img src="/assets/img/cspnet.png" alt="alt text" width="80%">
</p>

- Part 1 is sent through a series of transformations (e.g., convolutions, activation functions).

- Part 2 bypasses the transformations
