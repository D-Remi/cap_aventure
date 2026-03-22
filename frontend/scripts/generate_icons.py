#!/usr/bin/env python3
"""
Génère les icônes PWA pour CapAventure.
Lance avec : python3 generate_icons.py
Requiert : pip install pillow
"""
from PIL import Image, ImageDraw, ImageFont
import os, math

SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background circle gradient-like (bleu-nuit)
    margin = size * 0.04
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=size * 0.22,
        fill=(13, 44, 74, 255)
    )

    # Mountain silhouette
    cx, cy = size / 2, size / 2
    mh = size * 0.55
    mw = size * 0.72

    # Back mountain (lighter)
    back = [
        (cx - mw*0.5, size*0.78),
        (cx - mw*0.15, size*0.35),
        (cx + mw*0.12, size*0.50),
        (cx + mw*0.5, size*0.78),
    ]
    draw.polygon([(int(x), int(y)) for x, y in back], fill=(45, 138, 86, 200))

    # Main mountain (dark green)
    main = [
        (cx - mw*0.4, size*0.78),
        (cx, size*0.22),
        (cx + mw*0.4, size*0.78),
    ]
    draw.polygon([(int(x), int(y)) for x, y in main], fill=(26, 92, 58, 255))

    # Snow cap (white)
    snow_h = size * 0.12
    snow = [
        (cx, size*0.22),
        (cx - size*0.10, size*0.22 + snow_h),
        (cx + size*0.10, size*0.22 + snow_h),
    ]
    draw.polygon([(int(x), int(y)) for x, y in snow], fill=(235, 248, 255, 240))

    # "CA" text at bottom
    font_size = max(int(size * 0.15), 8)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', font_size)
    except:
        font = ImageFont.load_default()

    text = 'CA'
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (size - tw) // 2
    ty = int(size * 0.78) - th // 2

    draw.text((tx, ty), text, font=font, fill=(78, 203, 113, 255))

    return img

for size in SIZES:
    icon = generate_icon(size)
    path = os.path.join(OUTPUT_DIR, f'icon-{size}.png')
    icon.save(path, 'PNG')
    print(f'✅ {path}')

print(f'\n🎉 {len(SIZES)} icônes générées dans {OUTPUT_DIR}')
