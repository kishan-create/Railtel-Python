import json
import pandas as pd
import csv
import glob
import os
import time
#from pandas.io.json import json_normalize

def json_to_csv(files):

    normalize_json_files(files)
    combine_csv_files(files)

def normalize_json_files(files):

    time.sleep(5)

    for file_name in files:

        print("Converting JSON files in " + file_name + " to csv...")

        allFiles = glob.glob("../results/" + file_name + "/*.json")
        count = 0
        for file_ in allFiles:
            try:
                with open(file_, 'r') as json_data:

                    if file_name == "nodes_ip":
                        json_dict = json.load(json_data)
                        results = pd.json_normalize(json_dict["data"])

                        # convert json to csv
                        results.to_csv("../results/" + file_name + "/"+ str(count) + ".csv", index=False)

                    elif file_name == "default_route":
                        json_dict = json.loads(json_data.read())

                        val = len(json_dict['data'])
                        df = pd.DataFrame(json_dict['data'])
                        
                        displayname = df['display-name'].tolist()
                        ocid = df['id'].tolist()

                        mylist = []

                        for i in range(val):
                            results = pd.DataFrame(json_dict['data'][i-1]['route-rules'])
                            

                            # name_ = name.loc[name.index[0], 'display-name']
                            results["display-name.route_rules"] = displayname[i-1]
                            results["id.default_route"] = ocid[i-1]
                            mylist.append(results)
                        
                        dfs = pd.concat(mylist)

                        # convert json to csv
                        dfs.to_csv("../results/default_route_rules/"+ str(count) + ".csv", index=False)

                        json_dict = json.loads(json_data.read())
                        results = pd.DataFrame(json_dict['data'])
                        results.to_csv("../results/" + file_name + "/"+ str(count) + ".csv", index=False)

                    else:
                        json_dict = json.loads(json_data.read())
                        results = pd.DataFrame(json_dict['data'])

                        # convert json to csv
                        results.to_csv("../results/" + file_name + "/"+ str(count) + ".csv", index=False)
            except:
                # print(file_)
                pass
            count = count + 1

def combine_csv_files(files):

    time.sleep(10)

    for file_name in files:
        try:
            print("Combing JSON files in " + file_name + "...")
            allFiles = glob.glob("../results/" + file_name + "/*.csv")
            combined_csv = pd.concat( [ pd.read_csv(f) for f in allFiles ] )
            combined_csv = combined_csv.add_suffix("." + file_name)
            combined_csv.to_csv( "../results/compile/" + file_name + ".csv", index=False)
        except:
            #print(file_name)
            pass

def combine_jsons_1():

    files = []

    files.append("compartments")
    files.append("availability_domain")
    # files.append("volume_backup_policy")

    return files

def combine_jsons_2():

    files = []

    files.append("instances")
    files.append("vnic_attached")
    files.append("boot_attached")
    files.append("boot")
    files.append("volume_attached")
    files.append("volume")
    files.append("vcn")
    # files.append("bucket")
    # files.append("drg")
    # files.append("fast_connect")
    # files.append("drg_attachment")
    # files.append("virtual_circuit")
    files.append("load_balancer")
    # files.append("volume_backup_policy")
    # files.append("backup")
    # files.append("dbaas")
    files.append("boot_backup_volumes")
    files.append("shape")

    return files

def combine_jsons_3():

    files = []

    files.append("vnic")
    # files.append("volume_backup")
    # files.append("boot_backup")
    # files.append("images")

    return files


def combine_jsons_4():

    files = []

    # files.append("default_route")
    # files.append("default_route_rules")
    # files.append("security_list")
    # files.append("internet_gateway")
    files.append("volume_attached")
    files.append("subnet")
    files.append("public_ip")
    # files.append("nodes")

    return files

def combine_jsons_5():

    files = []

    files.append("nodes_ip")
    files.append("private_ip")

    return files
