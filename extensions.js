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
  name: 'FileViewerDownloader',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_file_viewer_downloader' || trace.payload.name === 'ext_file_viewer_downloader',
  render: ({ trace, element }) => {
    const { fileURL, fileType, fileName } = trace.payload;

    const container = document.createElement('a');
    container.setAttribute('href', fileURL);
    container.setAttribute('download', fileName);
    container.setAttribute('target', '_blank');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.margin = '10px 0';
    container.style.padding = '10px';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '5px';
    container.style.backgroundColor = '#f9f9f9';
    container.style.textDecoration = 'none'; // Remove underline from the link
    container.style.cursor = 'pointer';

    // Crear el ícono dependiendo del tipo de archivo
    const iconElement = document.createElement('div');
    iconElement.style.marginRight = '10px';

    if (fileType === 'application/pdf') {
      iconElement.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1667px-PDF_file_icon.svg.png" alt="PDF Icon" style="width: 40px;">';
    } else if (fileType.startsWith('image/')) {
      iconElement.innerHTML = '<img src="https://example.com/icons/image-icon.png" alt="Image Icon" style="width: 40px;">';
    } else {
      iconElement.innerHTML = '<img src="https://example.com/icons/file-icon.png" alt="File Icon" style="width: 40px;">';
    }

    container.appendChild(iconElement);

    // Crear el nombre del archivo
    const nameElement = document.createElement('div');
    nameElement.textContent = fileName || 'Download File';
    nameElement.style.flexGrow = '1';
    nameElement.style.fontSize = '16px';
    nameElement.style.color = '#333';

    container.appendChild(nameElement);

    element.appendChild(container);
  },
};

