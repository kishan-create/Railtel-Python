import pandas as pd
import csv
import datetime
import time

now = datetime.datetime.now()

day = str(now.day)
year = str(now.year)
month = str(now.month)

today = day + "-" + month + "-" + year

print("Creating OS breakdown report...")

# Resources
path ="../results/compile"
instances = pd.read_csv(path + "/instances.csv")
images = pd.read_csv(path + "/images.csv")

# Merging dataframes
os_count = pd.merge(instances,images,left_on="image-id.instances", right_on="id.images",how="inner")

# Combining OS name and version
os_count["image-id.instances"] = os_count["operating-system.images"] + " " + os_count["operating-system-version.images"]

# Remove duplicate instances via OCID due to inner merge
os_count.drop_duplicates(subset ="id.instances",keep = "first", inplace = True)

# Count reoccuring values in Images
os_count = os_count['image-id.instances'].value_counts()

# Output file.
os_count.to_csv("../results/os-count-" + today + ".csv", index=True, header=0)
