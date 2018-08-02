import cv2
import imageio

# for i, line in enumerate(list(open('task_reference_test.txt', 'r'))):
#     fname = 'test_reference/' + line
#     img = imageio.imread(fname.strip())
#     imageio.imwrite('ref_test_sorted/%d.jpg' % (i+1), img[:, :, :3])
#     print(i)


# for i, line in enumerate(list(open('task_reference_new.txt', 'r'))):
#     fname = 'ref_new/' + line
#     img = imageio.imread(fname.strip())
#     imageio.imwrite('ref_new_sorted/%d.jpg' % (i+1), img[:, :, :3])
#     print(i)


for i, line in enumerate(list(open('task_reference_train.txt', 'r'))):
    fname = 'references/' + line
    img = imageio.imread(fname.strip())
    imageio.imwrite('ref_train_sorted/%d.jpg' % (i+1), img[:, :, :3])
    print(i)
