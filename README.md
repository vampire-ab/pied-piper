# Template Project
Tools \& Frameworks
 - **NextJS**: Framework
 - **ReactJS**: Library
 - **Hardhat**: Testing Environment
 - **Rainbowkit**: Wallet Access
 - **Wagmi**: For blockchain interaction
 - **Huddle01**: Meeting rooms
 - **Viem & Ethers**: Interacting with EVM compatible chains
 - **Push Protocol**: Notification Services
 - **Lens Protocol**: Blockchain social identity protocol


### The root directory layout
    .
    ├── .next                   # Compiled and cached files
    ├── public                  # Public files
    ├── src                     # Source files (alternatively `lib` or `app`)
    ├── .gitignore                   
    ├── next.config.js          # Next configuration
    |── tailwind.config.js      # Tailwind configuration 
    └── README.md               # (this)

### The `src` directory layout
    .
    ├── components              # React components
    ├── pages                   # NextJS Pages
    ├── styles                  # Styling
    ├── tools                   # Protocols function requirements
    └── utils                   # Redundant Utilities

## Accessing Protocols
  ## 1. Huddle01 
  - Cross-chain audio and video communication. Link to [Documentation](https://huddle01.com/docs/React)
  - Understanding directory
    * Pages
       * Route ``/meet``
         ``` js
           func createAndJoinMeeting() -> fetches roomId and joins the lobby.  On successful execution, Routes to /meet/${roomId}
           func joinMeeting() -> RoomId exists, so joins the lobby. On successful execution, Routes to /meet/${roomId}        
         ```
       * Route ``/meet/${roomId}``
         + Join Lobby
         + In ``/src/components/huddle01``
            ``` js
              Huddle01.tsx          -> Complete Metting component
              Room.tsx              -> Room component with all features.
           ```
         + directory ``/util``
         + Can be used to update information by the user.           
           ``` js
              ChangeDisplayName.tsx -> Changes display name
              MyVideo.tsx           -> Access video
              Mic.tsx               -> Access Mic
              JoinRoom.tsx          -> Join Room
              LeaveRoom.tsx         -> Leaves Room, reloads pages, so joins lobby
              Recording.tsx         -> Not set up yet. To be used to record the meeting.
           ```
         + directory ``/info``
           These do not change state by user. Only information is fetched.       
           ``` js
              People.tsx            -> Show peers in the room
              Peers.tsx             -> Show camera and mic peers
              Name.tsx              -> Join Room
           ```
 ## 2. Push Protocol
  - Currently tested on page `/notify`
  > **Warning**
  > Using Javascript files because of type error
  - Imports from ``src/tools/push.js``
  - Channel Address <br />
     📌 Mumbai : ``eip155:137:0xdD2a64ea2637b938F1E1C28D1dA9e443B28513f9``    
     📌 Goerli : ``eip155:5:0xdD2a64ea2637b938F1E1C28D1dA9e443B28513f9``    
  - Signer is fetched from `/src/utils/privateSigner.ts`<br />
    <br />
       - Send notification from the channel to the recipient array.
         <br />       
    ```js
      func sendSubsetNotification(recipients)
    ```
       - Broadcast notification from the channel to all.         
    ```js
      func sendBroadcastNotification()
    ```


## Other Utilities
  + In directory ``/src/utils``
  + File ``customChains.ts``
    - Adding custom chains support on wagmi
  + File ``privateSigner.ts``<br />
      <br />
      - Returns walletClient, a private signer from viem (currently for push channel)
      ```js
          func privSigner() 
      ```
  + File ``providers.ts``
    - Structured providers for Lens, RainbowKit and Wagmi


