import glob, os, re


def rgb_to_hex(red, green, blue):
    """Return color as #rrggbb for the given color values."""
    return '#%02x%02x%02x' % (int(red), int(green), int(blue))


# category
dir_path = os.path.dirname(os.path.realpath(__file__))
print(dir_path)

# dict_cate_fileNames
d = {}

category_folder = "category_new"
reference_folder = "ref_new"

sub_dir_list = glob.glob('%s\\%s\\*' % (dir_path, category_folder))
for dir_item in sub_dir_list:
    category = dir_item[len(dir_path) + 1 + len(category_folder + "\\"):].lower()
    if category[-1:] == '2':
        category = category[:-1]
    p = category.find("_")
    if p >= 0:
        category = category[:p]
    d[category] = []
    print("Category:", category)
    sub_list = glob.glob(dir_item + '\\*')
    for item in sub_list:
        file_name = item[len(dir_path) + 1 + len(category_folder + "\\"):].replace("\\", "/")
        # if file_name.find("_flip") == -1:
        #     d[category].append(file_name)
        d[category].append(file_name)

        # print("->", file_name)
        files = glob.glob(item + '\\*')
        for f in files:
            file_name = f[len(dir_path) + 1 + len(category_folder + "\\"):].replace("\\", "/")
            # if file_name.find("_flip") == -1:
                # d[category].append(file_name)

            d[category].append(file_name)
                # print("->", file_name)

with open("category.txt", "w", encoding='utf-8') as f:
    f.write("%d\n" % len(d))
    for k, l in d.items():
        f.write("%s\n%d\n" % (k, len(l)))
        for name in l:
            f.write("%s\n" % name)

# fix category - color mapping
cateNames, cateColors, missingCates = [], [], []

for line in open("class_46.txt", "r"):
    line = line.strip().strip("'")
    cateNames.append(line)
    if not line in d:
        missingCates.append(line)

for line in open("color_46.txt", "r"):
    line = line.strip().strip("[").strip("]")
    cateColors.append(line)

with open("../js/input/category.js", "w") as f:
    f.write("'use strict';\nParas.allCategories = [\n")
    for k, l in d.items():
        f.write('"%s",\n' % k)
    for cate in missingCates:
        f.write('"%s",\n' % cate)
    f.write("];\n")
    f.write("Paras.cateColors = {\n")
    for i in range(len(cateNames)):
        [r, g, b] = cateColors[i].split(",")
        f.write('"%s" : "%s",\n' % (
            cateNames[i], rgb_to_hex(float(r), float(g), float(b))))
    f.write("};\n")
    f.write("Paras.missingCates = [\n")
    for cate in missingCates:
        f.write('"%s",\n' % cate)
    f.write("];\n")

with open("keyWordsList.txt") as f:
    lines = [line for line in f.read().splitlines()]

# fix missing reference keywords list
with open("keyWordsReferenceImageList.txt", "r") as f:
    reference_strings = f.readlines()

# parse reference folders

re_reference = re.compile("(\d+)\_(\w+)")
N = len(lines)
print("Total: ", N)
d = [[] for i in range(N)]
e = ["" for i in range(N)]
total = 0
total_category = 0
sub_dir_list = glob.glob('%s\\%s\\*' % (dir_path, reference_folder))
print(sub_dir_list)
for dir_item in sub_dir_list:
    print(dir_item)
    sub_list = glob.glob(dir_item + '\\*')
    for item in sub_list:
        # print(dir_item)
        category = item[len(dir_item) + 1:].lower()
        mat = re_reference.match(category)
        if mat is None:
            cid = int(category)
            category = reference_strings[cid].replace(",", "_").strip()
        else:
            cid = int(mat.groups()[0])
            category = mat.groups()[1]
        # print("References:", cid, category)
        e[cid] = category
        total_category += 1
        files = glob.glob(item + '\\*')
        for f in files:
            file_name = f[len(dir_path) + 1 + len("%s\\" % reference_folder):].replace("\\", "/")

            if file_name.find(".jpg") >= 0 or file_name.find(".png") >= 0 or file_name.find(
                    ".jpeg") >= 0 or file_name.find(".gif") >= 0:
                # print("%s %d" % (file_name, total))
                d[cid].append(file_name)
                total += 1
            else:
                fff = glob.glob(f + '\\*')
                for ff in fff:
                    file_name = ff[len(dir_path) + 1 + len("%s\\" % reference_folder):].replace("\\", "/")
                    if file_name.find(".jpg") >= 0 or file_name.find(".png") >= 0 or file_name.find(
                            ".jpeg") >= 0 or file_name.find(".gif") >= 0:
                        # print("%s %d" % (file_name, total))
                        d[cid].append(file_name)
                        total += 1

print("Writing references: ", total)
writted_cnt = 0

with open("references.txt", "w", encoding='utf-8') as f:
    f.write("%d\n%d\n" % (total_category, total))
    for cid, category in enumerate(e):
        if category:
            f.write("%d\n%s\n%s\n%d\n" % (cid, category, lines[cid], len(d[cid])))
            for name in d[cid]:
                f.write("%s\n" % name)
                writted_cnt += 1

print("Written references: ", writted_cnt)
