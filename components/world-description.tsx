export function WorldDescription() {
  return (
    <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm h-full">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
        <h2 className="px-4 text-2xl font-bold text-white">World Description</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
      </div>

      {/* Content */}
      <div className="space-y-4 text-white">
        <p className="leading-relaxed">
          This is a demo world used to showcase the features and functionality of the Foundry Virtual Tabletop software.
          This world was created using the{" "}
          <a href="#" className="text-orange-400 hover:text-orange-300 underline">
            Pathfinder Second Edition
          </a>{" "}
          game system, which extends support for the ruleset developed by{" "}
          <a href="#" className="text-orange-400 hover:text-orange-300 underline">
            Paizo Inc
          </a>
          , but there are{" "}
          <a href="#" className="text-orange-400 hover:text-orange-300 underline">
            over 200 game systems
          </a>{" "}
          available for Foundry VTT. The demo only allows access to player users, not the Gamemaster account.
        </p>

        <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
          <p className="text-sm">
            <span className="font-semibold">Password for Player Accounts:</span>{" "}
            <code className="bg-gray-800 px-2 py-1 rounded text-orange-400">foundry</code>
          </p>
        </div>

        <p className="leading-relaxed">
          Please enjoy experimenting with the software and be sure to join our{" "}
          <a href="#" className="text-orange-400 hover:text-orange-300 underline">
            Discord
          </a>{" "}
          server if you would like to get involved with the community, learn more, or ask questions.
        </p>

        <p className="leading-relaxed">
          Cheers, and happy gaming!
          <br />
          <span className="italic">The Foundry Virtual Tabletop Team</span>
        </p>
      </div>
    </div>
  )
}
