const StatesLoadingSkelton = () => {
  return (
    <section className="flex-col h-screen pt-64 bg-white">
      <div className="flex items-center justify-center space-x-2 dark:invert">
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-8 h-8 bg-black rounded-full animate-bounce"></div>
      </div>
      <div className="mt-5 text-3xl italic font-semibold text-center">
        Fetching States...
      </div>
    </section>
  )
}
export default StatesLoadingSkelton
