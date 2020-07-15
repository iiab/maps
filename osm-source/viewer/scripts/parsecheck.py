import argparse

parser = argparse.ArgumentParser(description='Videos to images')
parser.add_argument('indir', type=str, help='Input dir for videos')
parser.add_argument('outdir', type=str, help='Output dir for image')
args = parser.parse_args()
print(args.indir)

print(args.outdir)