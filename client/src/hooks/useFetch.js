import { useEffect, useState } from 'react'
import { GIPHY_API } from '../config';

const default_gif = 'https://acegif.com/wp-content/uploads/gif-shaking-head-38.gif';

export default function useFetch({ keyword }) {

    const [ gifUrl, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);


    async function fetchData() {

        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API}&q=${(keyword || 'milky').split(' ').join('')}&limit=1`);

            const { data } = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                console.log(`🐛  -> 🔥 :  fetchData 🔥 :  data`, data);
                setData(data[ 0 ]?.images?.downsized_medium?.url);
            } else {
                setData(default_gif);
            }
            setLoading(false);
        }
        catch (error) {
            setData(default_gif);
        }
    }

    useEffect(() => {

        if (keyword)
            fetchData();

    }, [ keyword ]);

    return [ gifUrl, loading ];
}