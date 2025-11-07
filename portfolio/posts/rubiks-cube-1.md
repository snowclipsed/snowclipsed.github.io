---
layout: post
title: Teaching Language Models to Solve Rubik's Cubes (Part I)
date: "2025-10-23"
description: How hard could it be?
tags: [reinforcement learning, computer science, deep learning]
---

## What are long horizon tasks (and why should we care about them)?

Science-fiction AIs such as TARS, Cortana or the Terminator all exhibit a quality that today’s systems still lack, which is the capacity to pursue far-off goals on their own. We do have “agents”, but once the chain of actions stretches beyond a certain number of turns their performance collapses, and there's no easy way of training these models. These _long-horizon tasks_ are exactly what I care about - how can we teach a language model to carry out long-horizon tasks without paying an astronomical training bill? 

This is exactly we will try to explore in this blog-series. In part I of this series, we will focus on using reinforcement learning methods head-on and analyse our results. In part II, we will use our learnings to make something better. 

But first.. we need a proxy task to experiment on.

## Why Must We Solve a Cube?

Ever solved a Rubik's cube? It's _deceptively_ hard when you're starting out. Sure, you can scramble it in a few seconds, but the state space you've just plunged into is combinatorial, and it contains roughly around \\(4.3 \times 10^{19}\\) possible configurations! To put it to scale, if you were to stack a tower of cubes for every state, you'd be shooting way past the current brightest star in the sky (Sirius) and then do it again past planet [Reach](https://www.halopedia.org/Reach). That's a lot of cubes. 

Traditional algorithmic solvers struggle with this enormousness, and this is why clever methods like the [two phase solver](https://kociemba.org/math/twophase.htm) exist. They narrow down the search space by satisfying a set of conditions. Learnt algorithms are the same way, they create latent representations and have biases which allow them to cut through most of the search space.

So you think about it, a Rubik's cube is exactly the kind of long-horizon problem we're looking to test - it takes multiple steps to reach the solution space, and it is verifiable that they reached a solution. The state graph is vertex-transitive (every scramble looks like every other scramble from the right vantage point), so there are no privileged "easy corners" where the agent can camp. 

Best of all, God, on an alias of the brute-force cluster that exhaustively enumerated the cube state group - has announced that the diameter of this graph is [20 moves in the half-turn metric](https://www.cube20.org/). Twenty! That is a _constant_ that fits inside a tweet (and makes our problem tractable to learn for an agent), yet the shortest path between two arbitrary vertices is still long enough to punish greedy myopia.
![alt text](godstable.png)

The cube is also _deterministic_. Which means, in principle, you only need the starting state to solve the whole thing - that's why blindfolded cubing exists! But it's hard because you cannot state-action mappings, the key again is cutting down these massive search spaces through learnt approaches. 

Humans get around this by only memorizing small algorithms like PLL using learning and pattern recognition to know _when_ to apply a combination of these algorithms to get closer to the solution.

## How are we going to do it?

There are several ways to teach a language model a new skill. If you want it deeply integrated into the model's fundamental capabilities, you'd include it heavily in the pretraining data mix. But pretraining is prohibitively expensive, and continued pretraining faces the same cost barrier. Supervised fine-tuning is cheaper - you just create input-output examples demonstrating the skill. The problem is that it's shallow. The model learns to pattern-match and mimic rather than truly internalizing the underlying capability. What if instead you could simulate an environment where the model experiments and learns through trial and error, discovering the skill on its own? That's exactly what reinforcement learning does, and unless you've been living under a rock, you've probably heard about it by now.

There's actually another reason that we're going to choose a Rubik's cube as our long-horizon problem of choice : The cube itself makes for a fascinating reinforcement learning study because it sits at this uncomfortable intersection where it _feels_ like it should be tractable for modern RL, but it keeps resisting straightforward RL approaches. So that's _exactly_ what we're going to do - hit the ground running with some straightforward approaches and see if they fail, and then try to investigate why.

## A Quick Detour: What's GRPO?

Now, there's various reinforcement learning algorithms that we can utilize to train our language model how to solve a rubik's cube. Among those dozens of policy-gradient acronyms floating around, Group Relative Policy Optimization is the one whose reference implementation already speaks transformer and comes with a great support from the verifiers library. That single convenience is why we borrow its machinery for the cube.

I'll only cover GRPO on a high level, but here are some resources if you want to read more about the internals of how GRPO works.

The ritual is actually disarmingly short. For a given scramble \\(s\\) we prompt the network once and sample a _batch_ of roll-outs:

$$ {\tau_1, \tau_2, \ldots, \tau_G}, \quad \text{each } \tau_i = (a_{i,1}, \ldots, a_{i,T_i}) $$

A _verifier_ (in our case a Kociemba solver) labels every trajectory with a sparse reward

$$ R(\tau_i) = \mathbb{1}[\text{cube-state after } \tau_i \text{ is solved}] $$

GRPO turns the batch into a _relative_ signal. Let:

$$ \bar{A}_i = R(\tau_i) - \langle R \rangle $$

be the advantage of trajectory \\(i\\) versus the batch mean \\(\langle R \rangle\\). The policy gradient is

$$ J\_{\text{GRPO}}(\theta) = \mathbb{E}\_{q, o\_i} \left[ \frac{1}{G} \sum\_{i=1}^{G} \min\left(\frac{\pi\_\theta(o\_i|q)}{\pi\_{\theta\_{\text{old}}}(o\_i|q)} A\_i, \operatorname{clip}\left(\frac{\pi\_\theta(o\_i|q)}{\pi\_{\theta\_{\text{old}}}(o\_i|q)}, 1-\epsilon, 1+\epsilon\right) A\_i \right) - \beta D\_{\text{KL}}[\pi\_\theta || \pi\_{\text{ref}}] \right] $$

In words: up-weight the moves that appear in _above-average_ roll-outs, down-weight the rest. The baseline is not a learned value network but the empirical mean of the _same_ group, so the update is _zero-centred_ by construction and needs no critic. When the model samples a group of trajectories, the algorithm pushes probability mass toward whichever ones scored above the group average. This works beautifully when your model can already occasionally stumble into some success, because then you have clear winners to amplify.


## Experiments with Reward Modeling

To get started, we need to first create our environment which will allow our language model to interact with a rubiks cube. And to create our environment, we need to solve two problems : 1) problem representation 2) reward model.

Let's quickly jump back to how humans solve Rubik's cubes ; each mental step we decide to play an algorithm of \\(N\\) moves. We can model after this behavior to incentivize the model to make its own algorithms ; a multi-turn setup where the model could take \\(K\\) turns of maximum \\(N\\) moves each. For verifiability, we will use the very popular [singmaster notation](https://www.speedsolving.com/wiki/index.php/Singmaster_notation): Each face gets a letter: F (front), B (back), U (up), D (down), L (left), R (right). The letter alone means turn that face 90° clockwise. We add a prime symbol (like R') for counterclockwise, or a 2 (like U2) for 180°. So "R U R' U'" means: right clockwise, up clockwise, right counter-clockwise, up counter-clockwise.

![alt text](singmaster.png)

The cube state has to be represented as text and each face (U/L/F/R/B/D) gets its own grid format with colors as single letters, looking something like `TOP(U): WRB/OWG/YWW`. It's regex-friendly, preserves spatial relationships, and reasonably compact. The model interacts through Singmaster notation by outputting moves in `<move>...</move>` tags.

For the RL setup, I used GRPO with a multi-turn structure where the model could take up \\(K\\) turns of \\(N\\) moves each. Since a sparse reward may be too harsh for the our policy when we're just starting out, we shape the reward for rewarding progress and efficiency while keeping the reward function as positive only:

- A small format bonus of \\(0.1\\) for using the correct `<move>...</move>` tags
- If it solves the cube: base reward of \\(1.0\\) plus an efficiency bonus \\(\min(1.0, \frac{d}{t})\\) where \\(d\\) is the initial distance and \\(t\\) is turns used
- If it doesn't solve it: a progress reward of \\(\frac{\max(0, d - d_{\text{final}})}{d}\\) that measures how much closer it got

During designing the reward, the primary idea is to keep enough variance between good and bad approaches. Remember, GRPO setup samples multiple rollouts per prompt, groups them, and pushes probability mass toward better-performing completions **within each group**.

### Curriculum

Feeding the agent 1–20-move scrambles on day one is educational malpractice. The trainer therefore exposes only scrambles in a user-chosen band \\([s_{\min}, s_{\max}]\\) and can be configured to expand the band once the rolling success rate exceeds a threshold. This is in contrast with an approach like DeepCubeA where they train their network on the full combination range, where there's no explicit curriculum but more of an emergent one because the model learns the combinations in the order of easy to hard. However, they train for hundreds of thousands of steps, which we cannot, so we schedule ours by hand and keep the wall-time budget honest.

### The Diagnostic: The 1-Move Test

Before we dream of twenty-move solutions we check whether the network can walk one step. This will both act as a baseline test for the capability of our models to solve the cube because we're testing if it can execute the most basic moves.

A 1-move scramble has exactly twelve legal continuations (6 Faces x 2 Directions); one of them rewinds the scramble, the other eleven leave the cube mixed. This will essentially make our reward structure sparser and essentially cancels out the "efficiency" term if the cube is unsolved and doubles it if it's solved, but since we've reduced our search space, it should be tractable.

A random policy should succeed with a probability \\(\frac{1}{12} \approx 8.3\%\\) per attempt. So even if we have 16 rollouts per group and given a single episode step, you should hit the correct move occasionally just by chance, and GRPO should immediately amplify it. However, this is not what we see in practice!

![alt text](flatreward.png)

As you can see, the mean reward stays relatively flat throughout and hugs the format bonus of 0.1. This is _not_ good and means that the model is generally not learning! Well, why is this happening? We can try and diagnose the issue by analyzing the completion logs to get a sense of what was going on. Using the logs we can plot the moves that the model likes to take, the moves it gets correct and the overall reward distribution.

![alt text](chart.png)

[_Note : We're only logging every 2 steps so not all the steps were captured, but this should be a decent sample size to allow us to understand what's going on._]

So, across 1,832 attempts we get 10 successful solves. That's a 0.55% success rate, and that's worse than random by about 10x! What's interesting is that it's not that the model has collapsed to a single move even though it's heavily skewed. We do see that the model clearly explores, but it just explores wrongly. It plays R about 420 times (which is nearly a quarter of the attempts) followed by B, L, D, U in decreasing frequency, and never really any prime moves or double rotations.

This extreme bias essentially creates extreme reward sparsity because there's no clear pattern for GRPO to latch onto, because there's basically no in group variance in most cases. When all your rollouts never solve anything, there's nothing to amplify. This is what happens when the prior is too strong, the signal becomes too sparse and too noisy to overcome the strong prior. There's a chance that this may work when scaled up, but that's an insane amount of compute to introduce a base capability!

## Reward-shaping, curricula, prayers

Once I realized that the 1-move test was failing, I tried getting inspired by Potential-Based Reward Shaping (PBRS)—adding \\(\gamma \Phi(s') - \Phi(s)\\) where \\( \Phi(s) = -0.5 \cdot d(s)\\). In traditional RL with learned value functions, this is theoretically sound because the value function absorbs the potential. But GRPO works on _relative_ differences within rollout groups so this results in shifting every advantage by the same constant and leaves the _relative_ structure untouched.

I also tried explicit distance feedback (telling the model "you're now \\(k\\) moves from solved" after each action), and showing the solved state as a reference ; thinking traces got more confident but they were still confidently wrong, so scores didn't improve. I tried various progress ratios, efficiency bonuses, completion bonuses. None of it mattered because the underlying problem was that the model never reached differentiated outcomes.

Reasoning models actually consistently outperformed non-reasoning models. I hypothesis this is not because they were reasoning better about cube mechanics, but because longer generations = more stochasticity in the action distribution = slightly more exploration. Still not enough to overcome mode collapse, though.

![alt text](thinkingbetter.png)

The representation experiments provided the final irony. I held a hypothesis that if we give the model a cube representation that is more represented in the dataset (by simply sampling the model about it), we may get better or more confident results. And yes! When I gave the model the flat unfolded net - the representation it found most natural - it started generating moves that looked _scarily_ informed. "Ah, I see the orange face needs to move to the top layer," it would declare, before proposing a sequence that would make any cuber weep. The model had learned to _talk_ about cubes like an expert while remaining fundamentally unable to _solve_ them. The distribution of the moves taken did not budge much but the models simply got more confident at justifying their moves!

![alt text](wrongmove.png)

## Post-mortem

### What GRPO does (and what it needs)

Let's be precise about how GRPO works. For each question, say \\(q\\), GRPO samples a group of outputs which we can represent as \\({o_1, o_2, o_3, \ldots, o_G}\\) from the old policy \\(\pi_{\theta_{\text{old}}}\\) and scores them with some rewards \\({r_1, r_2, r_3, \ldots, r_G}\\) and then computes the advantage function to measure how much better a particular response is compared to the average response in the group:

$$ A_i = \frac{r_i - \text{mean}({r_1, r_2, \ldots, r_G})}{\text{std}({r_1, r_2, \ldots, r_G})} $$

Verifiers by default uses a "corrected" GRPO variation that removes the normalization term from the advantage calculation. So the advantage actually becomes:

$$ A_i = r_i - \text{mean}({r_1, r_2, \ldots, r_G}) $$

Notice the critical thing here again, the advantage is literally coming from the *relative differences between the group*. When we talked about GRPO earlier, I briefly mention that GRPO works well if there's enough variance. However, if all the rewards in a group are similar, something else happens - the advantage \\(A_i \to 0\\) for all \\(i\\). Let's find out the downstream effects of this.

Now, the advantage will be used to optimize the policy by maximizing:
$$ J\_{\text{GRPO}}(\theta) = \mathbb{E}\_{q, o\_i} \left[ \frac{1}{G} \sum\_{i=1}^{G} \min\left(\frac{\pi\_\theta(o\_i|q)}{\pi\_{\theta\_{\text{old}}}(o\_i|q)} A\_i, \operatorname{clip}\left(\frac{\pi\_\theta(o\_i|q)}{\pi\_{\theta\_{\text{old}}}(o\_i|q)}, 1-\epsilon, 1+\epsilon\right) A\_i \right) - \beta D\_{\text{KL}}[\pi\_\theta || \pi\_{\text{ref}}] \right] $$

If all your rewards are similar, the advantage \\(A\_i \to 0\\) for all \\(i\\). If we plug this into the policy:

$$ J\_{\text{GRPO}}(\theta) \approx \mathbb{E}\_{q, o\_i} \left[ \frac{1}{G} \sum\_{i=1}^{G} 0 - \beta D\_{\text{KL}}[\pi\_\theta || \pi\_{\text{ref}}] \right] = - \beta D\_{\text{KL}}[\pi\_\theta || \pi\_{\text{ref}}] $$

So when \\(A_i \to 0\\) the objective reduces to just minimizing KL divergence from the reference policy! This effectively turns into a no-op because we're just trying to stay close to where we started and stay anchored to our initial bad policy. We can actually see this reflected in a very very small (and often zero!) grad norm which spikes from these incredibly sparse updates!

![alt text](gradnorm.png)

Let's calculate how many times do we actually get useful signal in our group from our 0.55% success rate. Suppose the number of rollouts per group is 16, then the probability that there's at least one success becomes:

$$ P(\text{at least 1 success}) = 1 - (1 - 0.0055)^{16} = 1 - (0.9945)^{16} \approx 0.084 $$

So only about 8.4% of groups have any success at all. In the other 91.6% of groups, all rewards cluster around 0.1 (format reward), all advantages are near zero, and the gradient collapses to pure KL regularization. This is also what the reward distribution graph justifies.

This immediately points towards the hypothesis that any strong baseline should immediately help in allowing a model to learn further. I am of course, remotely not the first person to observe this - if we look at the DeepSeekMath paper (which introduces GRPO), they try to explain why reinforcement learning works in the first place:

![alt text](deepseeksnippet.png)

Translation : They compare compares Pass@K ("does _any_ sample solve it?") with Maj@K ("does majority voting solve it?"). GRPO boosts Maj@K while barely touching Pass@K.

GRPO doesn't teach new skills. It shifts probability mass toward solutions the model can already sometimes produce. If your Pass@K is 0, the algorithm has nothing to amplify; the relative advantages stay zero and you burn compute turning the KL crank. Our 4B and 3B checkpoints sit squarely in the "Pass@K ≈0" regime.

There's a whole subfield which does study capability aquisition, and the consensus is quite clear: ["capability acquisition occurs during pre-training and continual fine-tuning, while GRPO mainly amplifies skills the base model already has"](https://arxiv.org/abs/2507.10616) and ["The method works by leveraging existing capabilities that do not easily emerge from greedy decoding but sometimes show up when working with higher temperatures."](https://huggingface.co/blog/lmassaron/gemma-grpo)

But does any model hold the mandate of the cube? (Or, at least for 1 move?). Well, I put OpenAI's latest family through the wringer. Here's what Pass@5 performance looks like:

![alt text](gpt5cube.png)

We can clearly see the capabilities evaporating as the parameter budget decreases and drops between some latent representation threshold. Our Qwen checkpoints sit _below_ GPT-5-nano, i.e. in the region where Pass@K is indistinguishable from zero.

However, the GPT-5 gap just doesn't sit right, so I ran some head-to-head on 1-move scrambles across families, and reran GPT-5.

|model|avg reward / 2.0|solves / 50|equiv. %|
|---|---|---|---|
|GPT-5|1.76|44|88 %|
|Claude Sonnet 4.5|0.60|15|30 %|
|Claude Opus 4|0.36|9|18 %|
|Gemini 2.5 Flash|0.20|5|10 %|
|Kimi k2|0.04|1|2 %|
|Qwen-235B|0.00|0|0 %|
|Qwen-4B|0|0|0 %|
|our Qwen-4B|~0|1 / 183|0.55 %|

Remember, random guessing sits at 8.3%. GPT-5 seems to be playing another game entirely, and the chinese models seem to be terrible shape rotators. I did expect claude to score higher than what it did, so that indeed comes as a surprise.||||

## Corpus Delicti

The corpus giveth and the corpus withholdeth. Internet text should be largely unhelpful to all the models in this regard. If we peek at the forums, they overflow with something like "spam the R U R′ U′ until the corner permutes" and "white cross first", but almost nobody writes out the full 54-sticker before/after. The causal model of "R maps _this_ state to _that_ state" is largely absent from the raw corpus, unless OpenAI has hands on some significantly large piece of multiturn puzzle data that it has generalized on.

Distillation tells the same story. Qwen 4B inherited every linguistic prior its 235B teacher had, hence the obsessive over-generation of R. But since the teacher itself never learned the conditional mapping, there was nothing _to_ distil. Strong-to-weak knowledge transfer works only when the _strong_ model actually possesses the knowledge. Compression can't create what isn't there. And our empirical observation with parameter scale dictates that the incredibly smaller distilled model should probably only perform worse.

To put all of this bluntly, the literature had drawn the map in fluorescent ink:

**"Here be dragons - bring either a bigger model, a distilled prior, or architectural biases that match the domain."**

And so I charged in with a 4B param scribbler and a dream.

The dragons won... for now.

![alt text](againstdragons.png)

## What's Next (Part II)?

GRPO can't bootstrap capability from nothing. So we stop praying for emergent algorithms and hand them to the model instead. Our cube simulator is also a bottomless generator for SFT : scramble, ask Kociemba for the optimal reversal, record the trace, repeat. Now you may say "erm, that's memorization" - but memorisation is not a dirty word here because it's needed as a warmup for building our functional baseline. Once the weights have cached the macro patterns we can go back to RL to _compress_ them.

However, we can also only do SFT for low-depths in our scramble graph since the possible state space expands exponentially (see figure) as the number of moves goes up. Another hard learnt lesson for RL is to take the pre-RL baseline more seriously because some tasks may just be too hard for a model to start with. So once that supervised checkpoint reaches a respectable solve-rate on held-out 5-move scrambles we unfreeze the RL loop. The answer also may lie in simply choosing a better model with an more acceptable baseline than Qwen, but I am not giving up on my tiny warriors just yet.

![cubegraph](cubegraph.png)
GRPO now starts from a prior that already respects primes and doubles, so its job is reduced to _compression_ by shaving excess turns and stitching algorithms. We can further augment this by doing something like multi-token prediction, but instead predict multiple moves at once, like our original environment envisioned, and then reward based on that. If all of this does not work, we can also look into less complex cubes, like 2x2 cubes with a much smaller state-space. 

Is there a way we can combat the model getting sparse rewards because of inherent biases by doing better exploration? Well, I (and some other people) think flow matching can help.

All shall be revealed in part II.

## Acknowledgements

Thanks a lot to [Will Brown](https://x.com/willccbb) and [Prime Intellect](https://www.primeintellect.ai/) for giving me credits that allowed me to dip my hands into RL. You have the mandate of heaven.

Also huge thanks to [Secemp](https://x.com/secemp9), [Eric W. Tamel](https://x.com/fujikanaeda), [ueaj](https://x.com/_ueaj), [vatsa](https://x.com/_vatsadev), [sinatras](https://x.com/myainotez) for their valuable feedback.