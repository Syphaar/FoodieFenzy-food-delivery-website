// import React from 'react'

// const FloatingParticles = ({ count = 40}) => {
//     const particle=  Array.from({length: count }, () => ({
//         top: Math.random() * 100,
//         left: Math.random() * 100,
//         duration: Math.random() * 2 + 2,
//     }))

//   return (
//     <div className='absolute inset-0 overflow-hidden pointer-events-none'>
//         {particle.map((list, index) => (
//             <div key={index} className="absolute w-1 h-1 bg-amber-400/40 rounded-full" 
//                 style={(top: `${list.top}%`, left: `${list.left}%`, animation: `float ${list,duration}s infinite`)}
//             ></div>
//         ))}
//     </div>
//   )
// }

// export default FloatingParticles


































// import React from 'react'

// const FloatingParticles = ({ count = 40 }) => {
//   const particles = Array.from({ length: count }, () => ({
//     top: Math.random() * 100,
//     left: Math.random() * 100,
//     duration: Math.random() * 2 + 2,
//   }))

//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {particles.map((particle, index) => (
//         <div
//           key={index}
//           className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
//           style={{
//             top: `${particle.top}%`,
//             left: `${particle.left}%`,
//             animation: `float ${particle.duration}s ease-in-out infinite`,
//           }}
//         />
//       ))}
//     </div>
//   )
// }

// export default FloatingParticles
























import React, { useState } from 'react'

const FloatingParticles = ({ count = 40 }) => {
  const [particles] = useState(() => 
    Array.from({ length: count }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 2 + 2,
      size: Math.random() * 3 + 1, // optional: random size
    }))
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute bg-amber-400/40 rounded-full"
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default FloatingParticles