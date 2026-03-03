'use client'
import { Image , buildSrc} from '@imagekit/next';
import { useState } from 'react';

const KitImage = (props:any) => {
     const [showPlaceholder, setShowPlaceholder] = useState(true);
  return (
     <Image
      
      {...props}
      loading="lazy"
      urlEndpoint='https://ik.imagekit.io/cqy7eyhof'
      style={showPlaceholder ? {
        backgroundImage: `url(${buildSrc({
          urlEndpoint: "https://ik.imagekit.io/cqy7eyhof",
          src: props.src,
          transformation: [
            {
              quality: 10,
              blur: 90,
            }
          ]
        })})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      } : {}}
      onLoad={() => {
        setShowPlaceholder(false);
      }}
    />
  )
}

export default KitImage
 