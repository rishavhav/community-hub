function ChannelList({ channels, selected, onSelect }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {channels.map((ch, index) => (
        <button
          key={ch._id || ch.id || index} // 💡 fallback to index if id is missing
          onClick={() => onSelect(ch._id || ch.id)}
          className={`px-4 py-2 rounded-full ${selected === (ch._id || ch.id) ? "bg-blue-600" : "bg-neutral-700 hover:bg-neutral-600"}`}
        >
          {ch.name}
        </button>
      ))}
    </div>
  )
}

export default ChannelList
