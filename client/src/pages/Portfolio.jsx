 function Portfolio() {
  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="border rounded-xl overflow-hidden">
          <div className="h-40 bg-gray-200"></div>
          <div className="p-4">
            <h3 className="font-semibold">Project {item}</h3>
            <p className="text-sm text-gray-600">
              React • Node • MongoDB
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Portfolio
