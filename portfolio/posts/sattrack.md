---
layout: post
title: Satellite Tracker
date: "2023-11-31"
description: A real- time satellite tracker written in Java.
tags: [orbital mechanics, java, computer science]

---

# Why this project?

A satellite tracker is something I have wanted to make since a long time. I had researched about [two line elements](https://en.wikipedia.org/wiki/Two-line_element_set) and how one can generate ground tracks for satellites using complex algorithms like SGP4, like in [this repo](https://github.com/anoved/Ground-Track-Generator). I wanted to understand concepts of orbital mechanics and map projection through a practical project


To deploy my project, please go to [this repository](https://github.com/snowclipsed/SatTrack) and follow the README instructions!

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

ArcGIS supports using Java to display an interactive map using a JavaFX application. JavaFX is a software platform and graphical user interface (GUI) toolkit for creating rich desktop applications. This means we can follow the standard JavaFx lifecyle of Initialization, Start, Scene, User interaction and updation, and Termination. We first initiate an Application class which has the main and the start functions. 

```Java
public class App extends Application {

    public static void main(String[] args) {
        Application.launch(args);
    }

    public void start(Stage stage) {
    }
}
```

JavaFX renders UI components in a heirarichal order. The start function passes a `stage` as a component. In JavaFX, `stage` represents an application window, and all the GUI is housed within that window. It is the first component in the heirarchy. A `stage` usually houses a GUI container called a `scene`. A `stage` may possess multiple `scenes` but only one is shown at a time. 

A `scene` houses `pane(s)`, which are the root node to which GUI components are attached.  A `pane` can be of many types depending on how we want our UI to render. You can read more about panes [here](https://docs.oracle.com/javafx/2/layout/builtin_layouts.htm)<d-cite key="oraclejavafxlayouts"></d-cite>. The type of pane we will be using for this project is called a StackPane. A StackPane is exactly what it sounds like, it is based on the Stack data structure and the nodes which are added to the StackPane first are rendered last, in the LIFO order. All of this comes together in 3 lines of code.

```Java
StackPane stackPane = new StackPane();
        Scene scene = new Scene(stackPane);
        stage.setScene(scene);
```

Next, we can start adding the map UI nodes. ArcGIS provides an SDK to render a map using their free developer API. You can import the libraries from ArcGIS by following [these instructions](https://developers.arcgis.com/java/install-and-set-up/) to use Gradle/Maven. I use Gradle in my setup in the repository. 

To access the API key we must first store it as a string in a seperate file which we can read the API string from.

```Java
 String yourAPIKey = System.getProperty("apiKey");
 ArcGISRuntimeEnvironment.setApiKey(yourAPIKey);
```
Then, we can create a new ArcGIS map and set the map to a MapView GUI node. 

```Java
ArcGISMap map = new ArcGISMap(BasemapStyle.ARCGIS_IMAGERY_STANDARD);

      // create a map view and set the map to it
      mapView = new MapView();
      mapView.setMap(map);
```
This will allow us to display the map in a JavaFX application window.

Next, we will learn how to fetch the required location information for the satellite using our RESTful API.

## Fetching Satellite Position

To fetch the position we are making use of [N2YO's free satellite API](https://www.n2yo.com/api/). To accomplish this, we need to define what variables we need from the API. Then, we can make a GET request to the API which then outputs a response in JSON containing the information we need.

The base URL format that we will be using is :

```json
/positions/{id}/{observer_lat}/{observer_lng}/{observer_alt}/{seconds}
```

Let us define a class `Satellite` which we will use to perform the GET request and store the information from the request. We will pass the variables to pass into the GET request as parameters to this class.

```Java
Satellite(String satID, String sec, String obsLat, String obsLong, String APIKEY) throws URISyntaxException, IOException, InterruptedException {
    ...

```

Next, we will use HttpRequest to build a GET request to send to N2YO.

```Java
HttpRequest getRequest = HttpRequest.newBuilder()
                .uri(new URI("https://api.n2yo.com/rest/v1/satellite/positions/" + satID + "/" + obsLat + "/" + obsLong + "/0/" + sec + "/&apiKey="+ APIKEY))
                .GET()
                .build();
```

We will then create an HttpClient and make a GET request to N2YO and try to get a response from the API. 

```Java
HttpClient httpClient = HttpClient.newHttpClient();
HttpResponse<String> getResponse = httpClient.send(getRequest, HttpResponse.BodyHandlers.ofString());
```

Since this response is being recieved as a Json String, we will have to parse this using a Json String parser to utilize the components inside. To do this, we first must look at a sample response given in N2YO's website:

```Json
{
  "info": {
    "satname": "SPACE STATION",
    "satid": 25544,
    "transactionscount": 5
  },
  "positions": [
    {
      "satlatitude": -39.90318514,
      "satlongitude": 158.28897924,
      "sataltitude": 417.85,
      "azimuth": 254.31,
      "elevation": -69.09,
      "ra": 44.77078138,
      "dec": -43.99279118,
      "timestamp": 1521354418
    },
    {
      "satlatitude": -39.86493451,
      "satlongitude": 158.35261287,
      "sataltitude": 417.84,
      "azimuth": 254.33,
      "elevation": -69.06,
      "ra": 44.81676119,
      "dec": -43.98086419,
      "timestamp": 1521354419
    }
  ]
}
```

We note that the response is in a nested format, so we must use define two classes for the `info` and `positions` section. Each of these classes will contain the get and set function for all the variables. On top of that, we must define a `Request` class which encapsulates both the subclasses. The names of the variables should be the same as the ones in the Json response.

Once we have created those classes, we can then use ObjectMapper to map the response body to the given variables inside the classes. We can then access these variables for the stored information.

```Java
ObjectMapper mapper = new ObjectMapper();

Request request = mapper.readValue(getResponse.body(), Request.class);


this.satname = request.info.satname;
this.satlong = request.positions.get(0).satlongitude;
this.satlat = request.positions.get(0).satlatitude;
```

Now that we have the information required, all that's left is to display the satellite as a point on the map and update the location in real time!

## Displaying the satellite on the map
Before we start displaying the satellite on the map, we need to create a map. In a from-scratch implementation we would consider adding a map and then calculating the coordinates per pixel on the map ourselves. This is a hard problem. Luckily, ARCGiS does this entire process for us. All we need to do is create a JavaFX application window, and then declare a MapView variable. This is our infinite scrollable and pannable workspace inside the JavaFX Application window which will house the map (so that we can zoom in and out and do everything we can with modern mapping applications like Google Maps).

```java
public class App extends Application {

    private MapView mapView;
    ...
```
Next, we create and call the map itself:

```java
ArcGISMap map = new ArcGISMap(BasemapStyle.ARCGIS_STREETS_NIGHT);
mapView.setMap(map);
```

There's a lot of map styles and can be accessed through BasemapStyle. I chose one with night mode cause it's cool.

Next, we create a graphics overlay to display our graphics (like our satellite image or any other line or point):

```java
GraphicsOverlay graphicsOverlay = new GraphicsOverlay();
graphicsOverlay.setLabelsEnabled(true);
mapView.getGraphicsOverlays().add(graphicsOverlay);
```

We then create a point to dislay on the overlay:

```java
Float[] coords = satAPICall(satID);
Point point = new Point(coords[0], coords[1], SpatialReferences.getWgs84());
```

Then we set a PictureMarker symbol to the point's coordinates:

```java
PictureMarkerSymbol satmarker = new PictureMarkerSymbol("src/Images/satimage.png");
satmarker.setHeight(40);
satmarker.setWidth(40);
```

Finally, so that we can apply the image on top of the overlay so it's rendered, we must create a JavaFX Graphic object, and add our graphic to the overlay:

```java
Graphic satpoint = new Graphic(point, satmarker);
graphicsOverlay.getGraphics().add(satpoint);
```

This will display our satellite, but right now we do not have any access to the coordinates we just found through the API. We will then define a function to set our point to a location by calling the API:

```java
public void setpoint(Graphic point, Graphic text, MapView mapView) throws URISyntaxException, IOException, InterruptedException {
    Float[] newcoords = satAPICall(satID);
    Point newpoint = new Point(newcoords[0], newcoords[1], SpatialReferences.getWgs84());
    point.setGeometry(newpoint);
    mapView.setViewpoint(new Viewpoint(newcoords[1], newcoords[0], scale));
}
```

Here, satAPICall is just an API calling function. You might notice that this function is not being called enough, so we will add a thread which keeps updating every N seconds. We set N as 10 at the top of our file.


```java
Thread updateThread = new Thread(() -> {
    while (true) {
        try {
            setpoint(satpoint, sattextgraphic, mapView);
            countdown(timeremaining);
        } catch (URISyntaxException | IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
        try {
            Thread.sleep(frequency);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
});

updateThread.start();
```

Nice! We can now display the satellite image. However, we have no way to actually choose any satellite right now. So let's try defining a list of satellites and a drop down (combo box) menu the queries for user input on that list:

```java

String[] satList = {
    "ISS",
    "Hubble Space Telescope",
    "IRIDIUM 167",
    "STARLINK-30783"
};

ComboBox<String> combo_box = new ComboBox<>(FXCollections.observableArrayList(satList));
combo_box.setValue("ISS"); // Default Value

stackPane.getChildren().add(combo_box);
StackPane.setAlignment(combo_box, Pos.TOP_RIGHT);
StackPane.setMargin(combo_box, new Insets(125, 100, 0, 0));

```

We will add a corresponding listener for the combo box:

```java
combo_box.setOnAction((event) -> {
    String selection = combo_box.getValue();
    satID = returnNORADID(selection);
    try {
        setpoint(satpoint, sattextgraphic, mapView);
        countdown(timeremaining);
    } catch (URISyntaxException | IOException | InterruptedException e) {
        throw new RuntimeException(e);
    }
    sattext.setText(selection);
});
```

Now, we will implement a very simple switch statement based function to return the NORAD ID of the satellites based on what satellite name the user has selected which we can use to make an API call with :

```java
public Integer returnNORADID(String satOption) {
    int ID;
    switch (satOption) {
        case "ISS":
            ID = 25544;
            break;
        case "IRIDIUM 167":
            ID = 43931;
            break;
        case "STARLINK-30783":
            ID = 58130;
            break;
        case "Hubble Space Telescope":
            ID = 20580;
            break;
        default:
            ID = 25544;
    }
    return ID;
}
```




