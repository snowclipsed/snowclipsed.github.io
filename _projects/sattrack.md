---
layout: distill
title: Satellite Tracker
description: A real- time satellite tracker written in Java using GIS APIs.
importance: 1
category: work
img: /assets/img/sattrack.jpg
bibliography: sattrack.bib

---

# Why this project?

A satellite tracker is something I have wanted to make since a long time. I had researched about [two line elements](https://en.wikipedia.org/wiki/Two-line_element_set) and how one can generate ground tracks for satellites using complex algorithms like SGP4, like in [this repo](https://github.com/anoved/Ground-Track-Generator). I wanted to understand concepts of orbital mechanics and map projection through a practical project

# Approach

A satellite tracker in principle works by displaying the coordinates of a given satellite at a point in time either through projecting its overhead coordinates on a map (2D) or displaying the satellite's position in a 3D environment. For this project, I use the classic first approach to project the location of a satellite on a map. 

To do this, we must look at the entire system through a Earth-centered reference frame in 3 dimensions. Then we can understand what exactly a projection is in the context of orbiting bodies. A projection is the intersecting point of the ground with a line drawn from the Earth's center to the satellite, such that the line is normal to the spherical coordinate system/the ground. <d-cite key="snyder1981map"></d-cite>

The crux of the problem is that the Earth and the satellite are moving at different speeds, and the reference frame is not. Both these bodies are also moving at non-constant velocities (since most satellites do not have a perfectly eccentric orbit, their speeds are not the same throughout the orbit). <d-cite key="stackoverflow_post"></d-cite> <d-cite key="space_stackexchange_post"></d-cite> 

Then, we convert the projection of a satellite's coordinates on the 3D sphere into 2D by changing out map projection from WGS84 to a cylindrical projection like mercerator.

<b> Note : </b> I will not be going into detail about orbital mechanics and map projections in this specific blog since this is more oriented towards the implementation of the project, but I will cover them in a seperate blog in the future! However, in case you are interested, check out the references in the end. <d-cite key="neacsu_snyder"></d-cite>

Luckily, there are several GiS tools which we can use to calculate and project satellite coordinates to maps. One such popular tool is [ArcGIS](https://www.arcgis.com/index.html) which can allow one to display interactive maps and perform geocode and display geocode based geometries on a map. ArcGIS offers a developer API key which can be used to build applications for non-consumer purposes. We will use the Java SDK and API service from ArcGIS to render our map and plot the satellite as a moving point on the map. 

However, we still have to figure out how to fetch the position of the satellite in real time. To do this, we can either compute the current position of the satellite by propagating two line elements to the current timestamp, or fetch the coordinates directly from a satellite tracker API. Many such free APIs exist, and I chose [N2YO's REST API](https://www.n2yo.com/api/) for the job. 

# Procedure

I developed the satellite tracker in the IntelliJ IDEA IDE. This can be done in any other Java IDE.

Let us first instantiate what functionalities we need in our tracker. To do that, let us revisit what exactly a satellite tracker means. In essence, a satellite tracker is a program which can display the live location of a given satellite. Some trackers also carry the capability to display the ground track of a satellite.

From this, we can extract our first goal, to display the location of one satellite on the map. But first, we first must display the map itself.

## Displaying a map using ArcGIS

ArcGIS supports using Java to display an interactive map using a JavaFx application. JavaFX is a software platform and graphical user interface (GUI) toolkit for creating rich desktop applications. This means we can follow the standard JavaFx lifecyle of Initialization, Start, Scene, User interaction and updation, and Termination. We first initiate an Application class which has the main and the start class functions. 

<d-code block language="java">

    public static void main(String[] args) {
        Application.launch(args);
    }
</d-code>