import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getLocalDapps } from 'src/utils/storage';
import { CommonLabel, DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { fetchLocal } from 'src/utils/chainweb';
import { hideLoading, showLoading } from 'src/stores/extensions';
import images from 'src/images';
import Button from 'src/components/Buttons';
import Transfer from './views/Transfer';
import { TransactionWrapper, FormSend } from './styles';
import { DappContentWrapper, DappDescription, DappLogo, DappWrapper } from '../Dapps/SignedCmd';

const Wrapper = styled(TransactionWrapper)`
  padding: 0;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.12);
`;

const NotFound = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;
const NotFoundImage = styled.img`
  width: 80px;
  height: 80px;
  margin: 110px auto 32px auto;
`;
const NotFoundDescription = styled.div`
  font-size: 18px;

  text-align: center;
  word-break: break-word;
  margin-bottom: 222px;
`;
export const PageSendTransaction = styled.div`
  display: block;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  bottom: 0;
  margin-bottom: 14px;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(226, 226, 226);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(54, 54, 54);
    border-radius: 2px;
  }
`;
const DappTransfer = () => {
  const [destinationAccount, setDestinationAccount] = useState<any>();
  const [loading, setLoading] = useState(true);
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  useEffect(() => {
    getLocalDapps(
      (dapps) => {
        console.log(`🚀 !!! ~ dapps`, dapps);
        const { account, chainId, sourceChainId } = dapps;
        const pactCode = `(coin.details "${account}")`;
        showLoading();
        fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, chainId)
          .then((res) => {
            const status = get(res, 'result.status');
            const exist = status === 'success';
            const pred = get(res, 'result.data.guard.pred');
            const keys = get(res, 'result.data.guard.keys');
            const newDestinationAccount = exist
              ? {
                  accountName: account,
                  sourceChainId,
                  chainId,
                  pred,
                  keys,
                  domain: dapps.domain,
                  dappAmount: dapps.amount,
                }
              : {};
            setDestinationAccount(newDestinationAccount);
            hideLoading();
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            hideLoading();
          });
      },
      () => {
        setLoading(false);
      },
    );
  }, []);
  return (
    <DappWrapper>
      {!loading && (
        <>
          <DappLogo src={images.xWalletIcon} alt="logo" />
          <SecondaryLabel style={{ textAlign: 'center' }} uppercase>
            {selectedNetwork.networkId}
          </SecondaryLabel>
          <DappContentWrapper>
            {destinationAccount && destinationAccount.accountName ? (
              <>
                <DivFlex flexDirection="column" alignItems="center" justifyContent="center" margin="10px 0px">
                  <CommonLabel uppercase fontSize={24} fontWeight="bold" isSendCommonLabel>
                    Send Transaction
                  </CommonLabel>
                  <SecondaryLabel>{destinationAccount.domain}</SecondaryLabel>
                </DivFlex>
                <Transfer
                  isDappTransfer
                  sourceChainId={destinationAccount?.sourceChainId}
                  destinationAccount={destinationAccount}
                  fungibleToken={{ symbol: 'kda', contractAddress: 'coin' }}
                />
              </>
            ) : (
              <NotFound>
                <NotFoundImage src={images.transfer.accountNotFound} />
                <NotFoundDescription>Destination account not found</NotFoundDescription>
                <Button label="Close" onClick={() => window.close()} />
              </NotFound>
            )}
          </DappContentWrapper>
        </>
      )}
    </DappWrapper>
  );
};

export default DappTransfer;
