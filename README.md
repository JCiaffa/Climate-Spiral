"# Climate-Spiral" 
The Climate Spiral is an animated data visualization graphic designed to demonstrate the progression of global warming. The graphic depicts global average temperature anomalies which are computed relative to a base period from 1951-1980. This dataset is proved by NASA.

The reason we work with anomalies, rather than absolute temperature, is that absolute temperature varies enormously over short distances, while monthly or annual temperature anomalies are representative of a much larger region.

The original climate spiral was published in 2016 by British climate scientist Ed Hawkins to portray global average temperature anomaly since 1850. The visualization graphic has since been expanded to represent other time-varying quantities such as atmospheric CO2 concentration, carbon budget, and arctic sea ice volume.

This application uses simple JavaScript and p5js in order to animate the dataset, which is stored separately as a CSV.
As new data is added to the set, an API could be used to access the maintained dataset to allow the animation to progress all the way to the current month,
however, that seems to fall outside the scope of this project. If the animation was based on data that was collected every day, or even week, it might
be more worthwhile to investigate this approach.
