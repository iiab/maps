/* sqlite script  -- open .mbtiles file and '.read summarize' to execute
# Find tiles with zoom > 9 (regional detail), and report max tilex, tily */
.headers on
.output summary
select zoom_level, max(tile_row),min(tile_row),max(tile_column),min(tile_column), count(zoom_level) from map where zoom_level > 4 group by zoom_level;

