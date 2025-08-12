# Android App Icons Guide

## Icon Requirements

Google Play Store requires several icon sizes:
- **Launcher Icons**: What users see on their device
- **Store Listing Icon**: 512x512px icon for the Play Store
- **Feature Graphic**: 1024x500px banner for the Play Store

## Creating Icons

### Option 1: Using Android Studio (Recommended)

1. Right-click on the `res` folder
2. Select **New > Image Asset**
3. Choose **Launcher Icons (Adaptive and Legacy)**
4. Configure your icon:
   - Foreground layer: Your icon design
   - Background layer: A solid color or simple pattern
5. Click **Next** and then **Finish**

### Option 2: Using Online Tools

You can use online tools to generate all required icons:
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/index.html)
- [AppIcon.co](https://appicon.co/)
- [Canva](https://www.canva.com/) (for feature graphics)

## Icon Specifications

### Launcher Icons
Android requires multiple resolutions for different device densities:
- `mipmap-mdpi`: 48x48px
- `mipmap-hdpi`: 72x72px
- `mipmap-xhdpi`: 96x96px
- `mipmap-xxhdpi`: 144x144px
- `mipmap-xxxhdpi`: 192x192px

### Adaptive Icons (Android 8.0+)
Adaptive icons consist of:
- Foreground layer (actual icon)
- Background layer (usually a solid color)
- Each layer should be 108x108dp with the inner 72x72dp being the safe area

### Play Store Listing Icons
- **High-res icon**: 512x512px PNG with alpha channel
- **Feature graphic**: 1024x500px JPG or PNG (no alpha)
- **Screenshots**: At least 2 screenshots for each supported device type

## Best Practices

1. **Keep it simple**: Simple icons work better at small sizes
2. **Use proper padding**: Leave space around your icon
3. **Test on different backgrounds**: Ensure your icon looks good on various wallpapers
4. **Follow Material Design guidelines**: For a consistent Android look
5. **Use vector graphics when possible**: For better scaling across densities

## Adding Icons to Your Project

1. Place your icon files in the appropriate `mipmap` folders
2. Update your `AndroidManifest.xml` to reference the icons:
   ```xml
   <application
       android:icon="@mipmap/ic_launcher"
       android:roundIcon="@mipmap/ic_launcher_round"
       ...
   >
   ```

## Play Store Graphics Checklist

- [ ] App icon (512x512px)
- [ ] Feature graphic (1024x500px)
- [ ] Phone screenshots (at least 2)
- [ ] 7-inch tablet screenshots (if supporting tablets)
- [ ] 10-inch tablet screenshots (if supporting tablets)
- [ ] TV screenshots (if supporting Android TV)
- [ ] Wear OS screenshots (if supporting Wear OS)

Remember that high-quality graphics significantly impact your app's perceived quality and download rates!