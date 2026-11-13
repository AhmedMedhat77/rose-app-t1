import PhotoGallery from "./PhotoGallery";
import TitleGallery from "./TitleGallery";

export default function Gallery() {
  return (
    <div className="container">
      <TitleGallery />

      <PhotoGallery />
    </div>
  );
}
