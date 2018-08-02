import glob, os

dir_path = os.path.dirname(os.path.realpath(__file__))
print(dir_path)
sub_dir_list = glob.glob(dir_path + '\\references\\*')
for dir_item in sub_dir_list:
    #print(dir_item)
    sub_list = glob.glob(dir_item + '\\*')
    for item in sub_list:
        z1 = item.find("Thumbs.db")
        if z1 > 0:
            print(item)
            os.remove(item)
        files = glob.glob(item + '\\*')
        for f in files:
            z1 = f.find("Thumbs.db")
            if z1 > 0:
                print(f)
                os.remove(f)
                continue
