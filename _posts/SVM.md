---
layout: post
title: "Unlocking the Power Behind Support Vector Machines : A Guide to SVMs"
subtitle: Let's delve into the magic behind intelligent decision making!
categories: ML
tags: [support vector machine, machine learning, classification]
---



<h2> Introduction </h2>

In the ever-evolving landscape of machine learning, Support Vector Machines (SVMs) stand tall as a formidable force. These remarkable algorithms transformed the way we approach pattern recognition and classification. With their ability to unravel complex relationships and make precise decisions, SVMs have become a go-to tool for data scientists across diverse domains.

In this guide, we take a grounded perspective, exploring the core concepts of SVMs and their real-world applications. SVMs excel in finding decision boundaries and navigating through intricate data landscapes, making them an invaluable asset in the data scientist's toolkit. Whether you're a curious learner or a seasoned practitioner, this guide aims to provide a realistic understanding of SVMs. We'll unravel their inner workings, examine their strengths and limitations, and discuss practical considerations for successful implementation.

So let's get right into it!

<h3> What are Support Vector Machines? </h3>

A support vector machine or SVM is a supervised learning algorithm that is primarily used for classification task (dealing with categorical data) , but can also be used for regression tasks (dealing with quantitative data). When dealing with classification tasks, the aim of an SVM is to find an optimal boundary called a *hyperplane* that can seperate data points of two or more classes. This optimization is done by maximizing the distance of the boundary - also called the *margin* - from the nearest data points of each class. These nearest data points are known as *support vectors*, hence the name *Support Vector Machine*.


<h3> Intuition on Hyperplanes and Support Vectors </h3>

In the paragraph above I define hyperplanes as a boundary, more so, a *decision boundary* which can separate groups of datapoints that lie together. But what exactly are those terms? For that, let's take an example. 

Suppose we have a dataset with two features X and Y, and a categorical target variable with classes A (Red Points) and B (Blue Points). This will form a two dimensional plot as below :

![Alt text](GraphPoints.gif)

Now, we have any a new datapoint that lies on the graph - how will can we tell if the point belongs to class A or class B? For that, we can take a simple approach : draw a line (or a curve, more on that later) between the points which best represents the border between the area that the two classes occupy. This line is called a decision boundary. However, we can draw infinitely many lines between the space of the points of the two classes, so what's the best line we can draw?

![Alt text](GraphSVM_ManimCE_v0.17.3.gif)

A support vector machine allows us to optimize this line, and the line is called a hyperplane. In fact, the hyperplane may not need be a line at all. A hyperplane is n-1 dimensional, where n is the number of features. So when we have two features, like in the case above, the hyperplane is a line. When we have 3 features, the line becomes a plane.

[insert visualization of 2D points becoming 3D and the line becoming a plane]

Coming back to finding the best hyperplane for our purpose, the best line we can draw between the two classes should be not too close to one and not too far from the other. An approach we can take to 'balance' our line so that it's not too close or far from one specific class, is to make the line be drawn such that it has the maximum distance from all the classes. How do we find this distance? For this - we can choose the datapoints that are closest to both the classes, or basically on the boundaries of each class. Such a point can be called a 'support vector'. 

Maximizing the distance of the hyperplane from these support vectors is the goal of the support vector machine. This distance is also called the 'margin'. Let's dive deeper into the inner workings of the SVM and how it calculates an optimized hyperplane.

[insert visual for support vector and margin]

<h3>How does the SVM work?</h3>

We discussed above the basic ideas behind what a SVM wants to do - now look at how it works. Suppose we want to form a decision boundary, which is a line $H$ between the two classes A and B, how do we mathematically represent the decision boundary? 

To achieve this, we can represent the line with a vector $ \vec{w} $ that is perpendicular to the line. Similarly, we are also able to represent every other point on the line with a vector as well. 

[insert gif of vector w perpendicular to the line H]

The advantage of representing the datapoints as vectors in the feature space is huge. One of the major advantages is easily classifying a new unseen point. 

Suppose we have a new point P and we want to find out whether it lies in class A or class B through an SVM. Hence, we simply take the vector form of point A, say $ \vec A$ and project it on the vector $ \vec w$. We can write this projection as :

$$
\vec w \cdot \vec P 
$$

If this projection is less than the perpendicular distance of the line $ H $ from the origin ($ C $), then the point would belong to class A. If it is greater than $C$, then it will lie in class B.  

Mathematically, we can represent it as :
$$ 
\vec w \cdot \vec P \ge C \\
\vec w \cdot \vec P - C \ge 0 \\ $$
$$ 
C = - B\\
\vec w \cdot \vec P + B \ge 0 \\
$$ 

where $B$ is a constant called bias, which we will look into later.

One might notice that the last equation $ \vec w \cdot \vec P + B \ge 0 $ is actually the equation of a line! Hence if we know the value of this line, we can classify any point.

Let's assume we know the value of $ \vec w = 3i + 2j$ and $ b = -2$. If we want to find whether the point $P(3,2)$ lies in class A or class B, we use the condition $ \vec w \cdot \vec P + B \ge 0 $ again, which after putting in the values of $\vec w$ and $B$ becomes : 

$$
3x + 2y -2 \ge 0
$$

where $x$ and $y$ are the coordinates of a point. If we substitute the points into this equation we get:
$$
3(3) + 2(2) -2 \ge 0
$$



