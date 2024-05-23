export const VideoExtension = {
  name: 'Video',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_video' || trace.payload.name === 'ext_video',
  render: ({ trace, element }) => {
    const { videoURL, autoplay, controls } = trace.payload;

    // Check if the URL is a YouTube link
    const isYouTube = videoURL.includes('youtube.com') || videoURL.includes('youtu.be');

    if (isYouTube) {
      const videoId = videoURL.includes('watch?v=') 
        ? videoURL.split('watch?v=')[1]
        : videoURL.split('/').pop();
      const embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;

      const iframeElement = document.createElement('iframe');
      iframeElement.setAttribute('src', embedUrl);
      iframeElement.setAttribute('frameborder', '0');
      iframeElement.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
      iframeElement.setAttribute('allowfullscreen', '');
      iframeElement.style.width = '100%';
      iframeElement.style.height = '250px'; // Set desired height
      element.appendChild(iframeElement);
    } else {
      const videoElement = document.createElement('video');
      videoElement.style.width = '100%';

      if (autoplay) {
        videoElement.setAttribute('autoplay', '');
        videoElement.setAttribute('muted', ''); // Muted attribute might be necessary for autoplay to work
      }
      if (controls) {
        videoElement.setAttribute('controls', '');
      }

      const sourceElement = document.createElement('source');
      sourceElement.setAttribute('src', videoURL);
      videoElement.appendChild(sourceElement);

      element.appendChild(videoElement);
    }
  },
};

export const FileViewerDownloader = {
  name: 'File',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_file_viewer_downloader' || trace.payload.name === 'ext_file_viewer_downloader',
  render: ({ trace, element }) => {
    const { fileURL, fileType, buttonText } = trace.payload;

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.margin = '10px 0';

    // Crear un elemento de vista previa dependiendo del tipo de archivo
    let previewElement;

    if (fileType === 'pdf') {
      previewElement = document.createElement('iframe');
      previewElement.setAttribute('src', fileURL);
      previewElement.style.width = '100%';
      previewElement.style.height = '500px';
      previewElement.style.border = '1px solid #ccc';
    } else if (fileType === 'image') {
      previewElement = document.createElement('img');
      previewElement.setAttribute('src', fileURL);
      previewElement.style.maxWidth = '100%';
      previewElement.style.border = '1px solid #ccc';
    } else {
      previewElement = document.createElement('div');
      previewElement.textContent = 'File preview not available';
      previewElement.style.margin = '20px 0';
    }

    container.appendChild(previewElement);

    const downloadButton = document.createElement('a');
    downloadButton.setAttribute('href', fileURL);
    downloadButton.setAttribute('download', '');
    downloadButton.textContent = buttonText || 'Download File';
    downloadButton.style.marginTop = '10px';
    downloadButton.style.padding = '10px 20px';
    downloadButton.style.backgroundColor = '#2e6ee1';
    downloadButton.style.color = 'white';
    downloadButton.style.borderRadius = '5px';
    downloadButton.style.textDecoration = 'none';
    downloadButton.style.textAlign = 'center';
    downloadButton.style.cursor = 'pointer';
    container.appendChild(downloadButton);

    element.appendChild(container);
  },
};
