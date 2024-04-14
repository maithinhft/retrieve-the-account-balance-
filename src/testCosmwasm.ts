import { CosmWasmClient } from 'cosmwasm';
import dotenv from 'dotenv';
import { LIMIT_USER } from './common/config/constant';
import { sleep } from './utils/utils';
import { UserCrawl } from './models/account.models';

dotenv.config();

async function run(start_after: string | null = null) {
    
    let client = await CosmWasmClient.connect(process.env.RPC_ORAI ?? "");

    while (true) {
        let message: any = {
            all_accounts: {
                start_after: start_after,
                limit: LIMIT_USER
            }
        }

        let response = await client.queryContractSmart(process.env.OCH_ADDRESS ?? "", message);
        sleep(1000);

        for (let i=0; i<response.accounts.length; i++) {
            let user = response.accounts[i];

            let balanceMessage: any = {
                balance: {
                    address: user
                }
            }

            let balanceResponse = await client.queryContractSmart(process.env.OCH_ADDRESS ?? "", balanceMessage);
            sleep(1000);
            
            let userCrawl = new UserCrawl({user: user, balance: balanceResponse.balance});

            await userCrawl.save();
            // users.push({user: user, balance: balanceResponse.balance});

            console.log(user, balanceResponse.balance);
        }

        if (response.accounts) {
            let length = response.accounts.length;
            start_after = response.accounts[length-1];
        } else break;

    }
    
}

run();

