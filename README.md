# mbtiles2tilejson

This is a npm package that generate TileJSON file from MBTiles file.

## Known Limitation

Currently this npm package support TileJSON Specification 2.0 only.

## Why?

When you want to create your own vector tile web maps, TileJSON file is pretty important.  
Because url of TileJSON is required to create your own Mapbox style specification.

Nowadays, there has been an industry standard produce process for creating your own vector tile web maps.

1. Get \*.pbf of OpenStreetMap
2. Generate \*.pbf -> \*.mbtiles as MBTiles with OpenMapTiles schema
3. Generate \*.mbtiles -> /z/x/y/\*.pbf
4. Deploy /z/x/y/\*.pbf to server
5. **Write TileJSON file of your vector tile server**
6. Write Mapbox style specification file (style.json) to styling and displaying your vector tiles
7. Write HTML/CSS/JS that load and draw the maps based on style.json

If you have a lot money, you can keep running server that can dynamically generate /z/x/y/\*.pbf from MBTiles file.  
Those MBTiles server also has capabilities to dynamically generate TileJSON file from MBTiles file.  
But if you are trying to extremely save money, you will want to serve /z/x/y/\*.pbf files on static web server.

My findings is that there is no good tools to just generate custom TileJSON from MBTiles.

I do not want to serve MBTiles.  
I want to just generate TileJSON.

(... I'm also feeling some pain with step 6, but I'd like to solve that with another tool)

If you interested to create your own vector tile web maps,  
You can see detail on https://scrapbox.io/yuiseki/How_to_create_your_own_vector_tile_web_maps

## Install

Install as a command:

```
npm i -g mbtiles2tilejson
```

Install as a package:

```
npm i mbtiles2tilejson
```

## Usage

MBTiles file path and URL option are required.

```
mbtiles2tilejson path/to/region.mbtiles --url http://localhost:3000/ > path/to/tiles.json
```

## Development

```
npm ci
npm run build
npm link
```
