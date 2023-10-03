import axios from 'axios';

export default async function fetchImages(name, page, per_page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=31350060-6fd355912bbf3f893372e3348&q=${name}&page=${page}&per_page=${per_page}&image_type=photo&orientation=horizontal&safesearch=true`
    );

    
    return response;
  } catch (error) {
    console.error(error);
  }
}
