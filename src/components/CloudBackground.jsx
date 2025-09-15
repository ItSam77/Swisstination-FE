const CloudBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-200"></div>
      
      {/* Animated Clouds */}
      <div className="absolute inset-0">
        {/* Cloud 1 */}
        <div className="absolute top-10 left-0 animate-float opacity-30">
          <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 40C25 40 15 30 15 20C15 10 25 0 40 0C50 0 58 6 62 15C67 5 77 0 88 0C103 0 115 12 115 27C115 30 114 33 113 36C125 36 135 46 135 58C135 70 125 80 113 80H40C25 80 15 70 15 58C15 50 20 43 28 40C32 40 36 40 40 40Z" fill="white" fillOpacity="0.7"/>
          </svg>
        </div>
        
        {/* Cloud 2 */}
        <div className="absolute top-32 right-10 animate-float-delayed opacity-40">
          <svg width="150" height="45" viewBox="0 0 150 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 30C18.75 30 11.25 22.5 11.25 15C11.25 7.5 18.75 0 30 0C37.5 0 43.5 4.5 46.5 11.25C50.25 3.75 57.75 0 66 0C77.25 0 86.25 9 86.25 20.25C86.25 22.5 85.5 24.75 84.75 27C93.75 27 101.25 34.5 101.25 43.5C101.25 52.5 93.75 60 84.75 60H30C18.75 60 11.25 52.5 11.25 43.5C11.25 37.5 15 32.25 21 30C24 30 27 30 30 30Z" fill="white" fillOpacity="0.6"/>
          </svg>
        </div>
        
        {/* Cloud 3 */}
        <div className="absolute top-60 left-1/4 animate-float-slow opacity-50">
          <svg width="180" height="54" viewBox="0 0 180 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M36 36C22.5 36 13.5 27 13.5 18C13.5 9 22.5 0 36 0C45 0 52.2 5.4 55.8 13.5C60.3 4.5 69.3 0 79.2 0C92.7 0 103.5 10.8 103.5 24.3C103.5 27 102.6 29.7 101.7 32.4C112.5 32.4 121.5 41.4 121.5 52.2C121.5 63 112.5 72 101.7 72H36C22.5 72 13.5 63 13.5 52.2C13.5 45 18 38.7 25.2 36C30 36 33 36 36 36Z" fill="white" fillOpacity="0.8"/>
          </svg>
        </div>
        
        {/* Cloud 4 */}
        <div className="absolute bottom-20 right-1/3 animate-float opacity-35">
          <svg width="160" height="48" viewBox="0 0 160 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 32C20 32 12 24 12 16C12 8 20 0 32 0C40 0 46.4 4.8 49.6 12C53.6 4 61.6 0 70.4 0C82.4 0 92 9.6 92 21.6C92 24 91.2 26.4 90.4 28.8C100 28.8 108 36.8 108 46.4C108 56 100 64 90.4 64H32C20 64 12 56 12 46.4C12 40 16 34.4 22.4 32C26.4 32 29.2 32 32 32Z" fill="white" fillOpacity="0.6"/>
          </svg>
        </div>
        
        {/* Cloud 5 */}
        <div className="absolute top-20 right-0 animate-float-delayed opacity-45">
          <svg width="140" height="42" viewBox="0 0 140 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 28C17.5 28 10.5 21 10.5 14C10.5 7 17.5 0 28 0C35 0 40.6 4.2 43.4 10.5C46.9 3.5 53.9 0 61.6 0C72.1 0 80.5 8.4 80.5 18.9C80.5 21 79.8 23.1 79.1 25.2C87.5 25.2 94.5 32.2 94.5 40.6C94.5 49 87.5 56 79.1 56H28C17.5 56 10.5 49 10.5 40.6C10.5 35 14 29.8 19.6 28C23.1 28 25.55 28 28 28Z" fill="white" fillOpacity="0.7"/>
          </svg>
        </div>
        
        {/* Cloud 6 */}
        <div className="absolute bottom-40 left-10 animate-float-slow opacity-40">
          <svg width="170" height="51" viewBox="0 0 170 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34 34C21.25 34 12.75 25.5 12.75 17C12.75 8.5 21.25 0 34 0C42.5 0 49.3 5.1 52.7 12.75C57.8 4.25 66.3 0 75.65 0C88.4 0 98.6 10.2 98.6 22.95C98.6 25.5 97.75 28.05 96.9 30.6C106.25 30.6 114.75 39.1 114.75 48.45C114.75 57.8 106.25 66.3 96.9 66.3H34C21.25 66.3 12.75 57.8 12.75 48.45C12.75 42.5 17 37.4 23.8 34C28.9 34 31.45 34 34 34Z" fill="white" fillOpacity="0.65"/>
          </svg>
        </div>
      </div>
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/5"></div>
    </div>
  )
}

export default CloudBackground
