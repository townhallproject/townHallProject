## The basemap

The first component of the Map is the basemap style. Through Mapbox Studio, we can change the way the map looks. The style is currently hosted by Mapbox, so we update the visuals in Studio instead of in our local code.

www.mapbox.com

```
username: townhallproject
```

For the account password, please reach out to @meganrm.

<img width="1001" alt="screenshot 2017-10-20 11 02 02" src="https://user-images.githubusercontent.com/9341928/31833097-b40e58c4-b586-11e7-8933-c62e502ad76d.png">

When you launch Studio you'll see a panel of layers & the map itself. The layers are appropriately labeled, but here's a quick run through:

#### Map Layers

<img width="1130" alt="screenshot 2017-10-20 11 02 46" src="https://user-images.githubusercontent.com/9341928/31833106-be9ee57e-b586-11e7-909e-59182a2ef8af.png">

- **district_interactive** | Invisible layer with the geodata for districts. This layer is above all else because it's the target layer used by our local code to determine which district someone is clicking on. **Don't change or rename** unless you're changing the local code too.
- **label layers** | Draw the labels for the described element. Sourced from OpenStreetMap. If you wanted to change when labels appeared, the font used for them, font size, etc. ect. you'd do it in these layers.
- **Selected_District, Senate, Districts** | These are the layers used to style a selected district/state. These layers are saved as invisible, as our local code will filters these layers to _only show the active district/states_. **After editing, make sure these are invisible by default.**
- **Bridges, Roads, Tunnels, Buildings** | OSM data maintained by Mapbox for these features. Style as need be! Might need to zoom in substaintially to see them.
- Water layers
  - **Bathymetry** | Adds the pretty bathymetry to the map. Sourced from Natural Earth Data.
  - **Water Lines** | Adds nice waterlines if a person zooms in.

#### Iconography

The icons we display on the map for each town hall are loaded in Studio as svgs and churned into a spritesheet. There is no layer for them, but you'll need to add them via Mapbox Studio. 

First you'll want your svg icon. I've used Illustrator to make them, but you can use your-favorite-vector-art-maker. When you save the SVG, be sure to set the CSS Properties field as `presentation attributes`.

<img width="539" alt="screenshot 2017-10-20 11 13 28" src="https://user-images.githubusercontent.com/9341928/31833202-2219611a-b587-11e7-83e2-3548c7c04eb0.png">


To add new icons, go to a text layer in Studio, then click the 'icon' tab. From there you can open the spritesheet by clicking the input field next to Image. There you can upload the new svg. When we reference it in the code, it will match the filename.

<img width="1137" alt="screenshot 2017-10-20 11 03 20" src="https://user-images.githubusercontent.com/9341928/31833114-c549d582-b586-11e7-913b-2ac0f7933731.png">

#### Data

The basemap uses a handful of data sources put together by myself. They include:

- **Bathymetry** | Sourced from Natural Earth Data
- **newdistricts** | Sourced from Census.gov, personally edited.

## Local Code

So, now that we have the basemap mostly designed, we're good to bring it into the local code that runs the site.

Here's a quick run through of how we're managing it.

[Calls the map from Mapbox](https://github.com/townhallproject/townHallProject/blob/development/scripts/views/mapView.js#L19-L34), assigns it some base values.

[Sets which interactions are allowed](https://github.com/townhallproject/townHallProject/blob/development/scripts/views/mapView.js#L38-L42).

[Once the map has loaded](https://github.com/townhallproject/townHallProject/blob/development/scripts/views/mapView.js#L44), we do the following functions:

- **backSpaceHack** | If the user hits backspace, the map reverts to it's default
- **makeZoomToNationalButton** | Creates the custom "to USA" icon that zooms the user back to the national view.
- **addDistrictListener** | Using our invisible district layer, this adds event listeners to each district that enable most of our interactivity.
- **addPopups** | Creates popup elements for each town hall point.
- **addLayer** | Creates the pins for each town hall & assigns the relevant popups to each.