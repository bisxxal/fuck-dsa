import { useEffect, useState } from "react"

const usePlatform = () => {
    const [platform, setPlatform] = useState<string>("")

    useEffect(() => {
        const p = window.electronAPI.getPlatform()
        setPlatform(p)
    }, [])

    return { platform }
}

export default usePlatform