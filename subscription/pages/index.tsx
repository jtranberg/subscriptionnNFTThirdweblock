import { ConnectWallet, useAddress, useContract, useContractRead, useContractWrite, Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

export const contractAddress = "0x8109DA5259376ea70dB7148b2A2C7939aecA3f0D";



const Home: NextPage = () => {
const address = useAddress();
//get lock contract we deployed
const { contract } = useContract(contractAddress);
//determine state of subscription
const { data: subscribed, isLoading } = useContractRead(
  contract,
  "getHasValidKey",
  address
);

// read duration of subscription
const { data: expirationDuration, isLoading: expirationLoading } = 
useContractRead(contract, "expiration");

const { mutateAsync: purchase } = useContractWrite(contract, "purchase");
const call = async ()=> {
  try {
    const data = await purchase([
      [0],
      ["0x0000000000000000000000000000000000000000"],
      [address],
      [0]
    ]);
    console.info("contract call success", data);
  }catch (err) {
    console.error("contract call failure", err);
  }
}
  
  return (
   <div className="{styles.container}">
    <h1 className="{styles.h1">Ulock Protocal Example</h1>
     <div className="{styles.pageContainer}">
      <p className="{styles.explain}">
        Am example project on how you can use {""}
        <a
          href="https://unlock-protocol.com/"
          target="_blank"
          rel="noopener noreferre"
          className={styles.purple}>
            unlock
            </a>
            &apos:s Public Lock contract to create subscription NFTs with {""}
            <a 
            href="https;//thirdweb.com/"
            target="_blank"
            rel ="noopener noreferre"
            className={styles.purple}
            >
              third web
              </a>
          </p>
        </div>
      
          {address ? (
            isLoading ? (
              <h1 className={styles.h1}>Loading...</h1>
            ) : (
              <div className={styles.spacerTop}>
               {subscribed ? (
                <div className={styles.spacerTop}>
                {expirationLoading ? (
                  <h1 className={styles.h1}>Loading...</h1>
                ) : (
                  <p className={styles.h1}>
                  Thanks for subscribing. your subscription is valid for a tot of{""}
                  {new Date(expirationDuration.toNumber() * 1000)
                  .toISOString()
                   .slice(11, 6)}{""}
                   hour(s)!
                  </p>
                )}
                </div>
               ) : (
              <Web3Button
              contractAddress={contractAddress}
              className={styles.mainButton}
              colorMode="dark"
              accentColor="#F213A4"
              action={call}
              >
                Subscribe
                </Web3Button>
            )}
                  <div className={`${styles.mainButton} ${styles.spacerTop}`}>
                <ConnectWallet/>
               </div>
            </div>
           )
        ) : (
    <div className={styles.spacerTop}>
      <ConnectWallet/>
    </div>
       )}
  </div>
  );
};

export default Home;