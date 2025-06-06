export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Pemuda Hikma</h3>
            <p className="text-gray-400">Building a better community</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-300">Facebook</a>
            <a href="#" className="hover:text-blue-300">Instagram</a>
            <a href="#" className="hover:text-blue-300">Twitter</a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pemuda Hikma. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}