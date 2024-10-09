import pandas as pd
import csv
from pandas import DataFrame, ExcelWriter
import datetime
import time
import os
import glob
import numpy as np

now = datetime.datetime.now()
day = str(now.day)
year = str(now.year)
month = str(now.month)
today = day + "-" + month + "-" + year

path ="../results/compile"

default_route_rules = pd.read_csv(path + "/default_route_rules.csv")
vcn = pd.read_csv(path + "/vcn.csv")
subnet = pd.read_csv(path + "/subnet.csv")

df1 = pd.merge(default_route_rules,vcn,left_on="id.default_route.default_route_rules", right_on="default-route-table-id.vcn",how="left")
df2 = pd.merge(default_route_rules,subnet,left_on="id.default_route.default_route_rules", right_on="route-table-id.subnet",how="left")

df1 = df1 [
    [
        "display-name.vcn",
        "display-name.route_rules.default_route_rules",
        "cidr-block.default_route_rules",
        "destination.default_route_rules",
        "destination-type.default_route_rules",
        "network-entity-id.default_route_rules"
    ]
]

df1.columns = [
    "VCN",
    "Route Table",
    "cidr-block",
    "destination",
    "destination-type",
    "network-entity-id"
]

df2 = df2 [
    [
        "display-name.subnet",
        "display-name.route_rules.default_route_rules",
        "cidr-block.default_route_rules",
        "destination.default_route_rules",
        "destination-type.default_route_rules",
        "network-entity-id.default_route_rules"
    ]
]

df2.columns = [
    "Subnet",
    "Route Table",
    "cidr-block",
    "destination",
    "destination-type",
    "network-entity-id"
]


df1['VCN'].replace('', np.nan, inplace=True)
df2['Subnet'].replace('', np.nan, inplace=True)
df1.dropna(subset=['VCN'], inplace=True)
df2.dropna(subset=['Subnet'], inplace=True)

with pd.ExcelWriter("../results/route_table-" + today + ".xlsx") as writer:
    df1.to_excel(writer, sheet_name='vcn', index=False)
    df2.to_excel(writer, sheet_name='subnet', index=False)
