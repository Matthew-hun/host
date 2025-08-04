import React, { FC, useEffect, useState } from 'react'
import { Match } from '../types/types'


const MatchStats = () => {
    const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

    useEffect(() => {
        const localStorageMatch = localStorage.getItem("match");
        if (localStorageMatch) {
            const parsedMatch = JSON.parse(localStorageMatch);
            setCurrentMatch(parsedMatch);
        }
    }, []);

  return (
    <div>
        asd
    </div>
  )
}

export default MatchStats