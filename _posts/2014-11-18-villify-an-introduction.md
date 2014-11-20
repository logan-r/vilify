---
layout: post
title: Vilify - An Introduction
category: Game Overview
excerpt: An introduction to Vilify and its game mechanics.
---
<p>
    Hello world!
</p>

<p>
    Vilify is an open-source html5 game that is currently a work in progress. 
    The premise behind Vilify is that you are a mad scientist who has just 
    completed a world destruction device. Heroes from all over the world are
    racing to your lab to destroy it before you set it off. Now with ten minutes
    left on the timer, you are in a race against time to defend it from those
    pesky heroes. Build abominable towers and create vile monsters
    to defend your lab!
</p>

<p>
    Vilify is loosely contained within the genre of being a 
    <a href="wikipedia.org/wiki/Tower_defence">tower defense game</a>,
    though it has many of the elements and mechanics of a 
    <a href="http://en.wikipedia.org/wiki/Platform_game">platformer game</a> too.
</p>

<hr>

<p>
    <b>Objective:</b>
    Your doomsday device is set to go off in ten minutes!
    Don't let the heroes destroy it before then.
</p>

<hr>

<p>
    <b>Heroes:</b><br>
    Heroes spawn on the left side of the screen and move rightwards. If a hero
    reaches the right side of the screen before the doomsday device goes off,
    you lose. Checkout the
    <a href="https://github.com/logan-r/vilify/wiki/Heroes">game guide</a>
    for all the heroes in the game and their stats.
    
    <br>
    
    <img src="//i.imgur.com/aU0dDON.png" class="img">
</p>

<hr>

<p>    
    <b>Defenses:</b><br>
    You can stop heroes from reaching your doomsday device via two methods: building towers and creating monsters.<br>
    <ol>
        <li>
            Towers are built on the roof of your lab.
            They fire bullets, missiles, laser beams and other stuff down at
            heroes below. Towers last indefinitely (or at least until you are
            overrun by the heroes and have to restart the game). The player can
            tap on a tower to activate its special abilities, if it has one.
            Checkout the <a href="https://github.com/logan-r/vilify/wiki/Towers">
            game guide</a> for a list of towers that the player can build and
            their stats.
        </li>
        
        <li>
            Monsters patrol the ground (and/or the air, if they can fly) of your
            lab. They enter direct combat with heroes and, unlike towers, can
            die. However, they tend to do more damage than towers and block
            heroes' movement towards your doomsday device. The player can 
            control a monster by swiping from the monster to a point to make 
            the monster move to that point. The player can also tap on a monster
            to activate special abilities, if it has any.
            Checkout the <a href="https://github.com/logan-r/vilify/wiki/Monsters">
            game guide</a> for a list of monsters that the player can build
            and their stats.
        </li>
    </ol>
    
    <img src="//i.imgur.com/wUxADYd.png" class="img">
</p>

<hr>

<p>
    <b>Items:</b><br>
    When the player defeats an enemy the player can get items. Items are the
    currency of the game - they are what the player uses to purchase towers and
    monsters. There are 3 types of items:
    
    <ol>
        <li>Tech</li>
        <li>Chemical/Biological (the final name for this category is not yet decided)</li>
        <li>Alien</li>
    </ol>
    
    We often abbreviate the items to their first letter: <b>T</b>, <b>C</b> &
    <b>A</b> for Tech, Chemical, and Alien respectively. A player's items are
    stored on the right of the screen (see the image below). To purchase a new
    tower with an item, the player drags an item to an unbuilt tower spot on the
    roof. To purchase a new monster, the player drags an item to the lab floor
    (i.e. the bottom of the screen). In order to upgrade an existing tower or
    monster, the player can drag an item to that tower or monster. The rank of a
    monster or tower depends on the number of items spent on it: a newly created
    tower/monster will be rank 1, and for each item spent to upgrade the 
    tower/monster, it will be a rank higher. At most, a tower or monster can be
    upgraded 2 times. Therefore, the highest rank a monster or tower can reach is
    3. The type of a tower or monster depends on the items spent on it. The
    <a href="https://github.com/logan-r/vilify/wiki/Monsters">monsters</a>
    and <a href="https://github.com/logan-r/vilify/wiki/Towers">towers</a> pages
    from the game guide have all the towers and monsters listed by the types of
    items need to make them. Cyborg - a rank 2 monster - is denoted by <b>[TA]</b>
    meaning that the cyborg is either a monster created by a <b>Tech</b> item
    and upgraded with a <b>Alien</b> item or a monster created by an <b>Alien</b>
    item and upgraded with a <b>Tech</b> item.<br>
    
    <img class="img" src="http://i.imgur.com/nGmQNJq.png">
</p>

<hr>

<p>
    So that about wraps up the primary mechanics of the game. If you have any questions stop by our <a href="https://www.hipchat.com/invite/205301/121e488078d93033a4133e430ce00c4b">HipChat</a> to
    discuss them. Also, we'd love your help turning Vilify into a reality so checkout our <a href="/contribute">contribute</a> page when you've got some spare time!
</p>

<p>
    Peace out,<br>
    - Logan
</p>