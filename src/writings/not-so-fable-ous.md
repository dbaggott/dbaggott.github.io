---
title: "Not so Fable-ous"
date: 2026-11-13
---
I'm using Claude and happily planning out something complicated and important^[at least to me]. I'm on Fable^[the right model for the right job]. The world is good, except it's not.

Some number of sessions later, I *finally* notice that instead of switching my model for that one session, I saved my switch to the expensive model for all future sessions.

In short, I've been burning through my usage and I've been oblivious!  Enter `dnbg-comforts`, a Claude plugin that prevents me from making this mistake ever again.

Now when I accidentally do this, I get a nice loud notice:

![Status line after /model saved Fable 5.2 as the default: a red "FABLE 5.2 · all future sessions!" badge](/images/writings/not-so-fable-ous-all-future-sessions.png)

About 30 seconds later, it returns to its normal mode, which drops the "all future sessions" alert and simply makes it very visible when I'm using a non-default model.

Note that there are some other "comforts" -- information about the context size relative to when it auto-compacts, whether your prompt cache is still warm (a cold one makes the next turn more expensive), your usage, and when your usage next resets.

Here are some examples of it in action. On Fable, with a cold cache:

![Status line with a red FABLE 5.2 badge and a yellow "cache ~cold" badge](/images/writings/not-so-fable-ous-cold-cache.png)

If the cache is cold and the context large, I evaluate whether I want to start a fresh session or spend the tokens and continue the current one^[This is an easy decision when you never treat your context as state, which I built my workflow plugins around.  See <https://github.com/dbaggott/dnbg-plugins#opinions>].

On Sonnet, with the cache warm:

![Status line with a blue SONNET 5.5 badge and "cache ~warm 59m"](/images/writings/not-so-fable-ous-warm-cache.png)

Or, when using your normal model:

![Status line on the default model: no model badge, just context, cache and usage](/images/writings/not-so-fable-ous-default-model.png)

A couple of other things it adds:

1. **Transcript backups.** Before a context is compacted, it saves the full original transcript.  I rarely need this but every once in a great while I'm grateful to have the original transcript available.
     
2. **`/later some message`.** Sends a message to your agent without waking it and burning a turn.  The agent will get your message once it wakes for some other reason. I use this for cases where the agent is waiting on background tasks, for example a code review, and I have something to tell it but it can process it along with the background task results.
   
   Admittedly, this is a hyper-optimization that I mostly don't use unless I'm in a situation where I'm being very conservative about my usage for some reason, e.g. I'm at 99% usage and I'm trying to finish something.

If you want to try this out, it's as easy as pasting the following into your terminal:

```
claude plugin marketplace add dbaggott/dnbg-plugins
claude plugin install dnbg-comforts@dnbg
claude
```

See <https://github.com/dbaggott/dnbg-plugins#dnbg-plugins> for more plugins available from this marketplace.
