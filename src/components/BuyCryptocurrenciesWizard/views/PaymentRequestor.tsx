import React from 'react';
import styled from 'styled-components';
import { CommonLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { PaymentRequestorViewProps } from './types';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  height: 75px;
  text-align: center;
`;

const Summary = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 80px;
  margin: 20px 0;
`;

const Details = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 40px;
  margin: 20px 0;
`;

const Pair = styled.div`
  text-align: center;
`;

const SummaryKey = styled.div`
  font-size: 24px;
`;

const SummaryValue = styled.div`
  font-size: 40px;
  font-weight: bold;
`;

const Key = styled.div`
  font-size: 18px;
`;

const Value = styled.div`
  font-size: 24x;
  font-weight: bold;
`;

const PaymentRequestor = ({
  quote,
  requestPayment,
  // refreshQuote,
}: PaymentRequestorViewProps) => {
  // const [missingSeconds, setMissingSeconds] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  // const isExpired = missingSeconds <= 0;

  /* React.useEffect(() => {
    let id: number;

    const updateSeconds = () => {
      const distanceInMsecs = quote.validUntil - Date.now();
      const distanceInSeconds = Math.round(distanceInMsecs / 1000);
      const newMissingSeconds = Math.max(0, distanceInSeconds);
      setMissingSeconds(newMissingSeconds);

      if (newMissingSeconds > 0) {
        const nextTick = distanceInMsecs % 1000;
        id = window.setTimeout(updateSeconds, nextTick);
      }
    };

    updateSeconds();

    return () => { window.clearTimeout(id); };
  }, [quote]); */

  const handleRequestPayment = () => {
    requestPayment();
  };

  /* const handleRefresh = async () => {
    await refreshQuote();
    setIsLoading(false);
  }; */

  const handleClick = () => {
    setIsLoading(true);
    /* isExpired ? handleRefresh() : */ handleRequestPayment();
  };

  // const actionText = isExpired ? 'Quote expired. Click to refresh' : `Confirm (${missingSeconds})`;
  const actionText = 'Confirm';
  const confirmButtonText = isLoading ? '...' : actionText;

  return (
    <Container>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>Confirm quote</CommonLabel>
      </Header>
      <div>
        <Summary>
          <Pair>
            <SummaryKey>You send</SummaryKey>
            <SummaryValue>{quote.fiatTotalAmount} {quote.fiatCurrency}</SummaryValue>
          </Pair>
          <Pair>
            <SummaryKey>You get</SummaryKey>
            <SummaryValue>{quote.cryptoAmount} {quote.cryptoCurrency}</SummaryValue>
          </Pair>
        </Summary>

        <Details>
          <Pair>
            <Key>Price</Key>
            <Value>1 {quote.cryptoCurrency} = {quote.fiatBaseAmount / quote.cryptoAmount} {quote.fiatCurrency}</Value>
          </Pair>
          <Pair>
            <Key>Fee</Key>
            <Value>{(quote.fiatTotalAmount - quote.fiatBaseAmount).toFixed(2)} {quote.fiatCurrency}</Value>
          </Pair>
        </Details>

        <Button isDisabled={isLoading} onClick={handleClick} label={confirmButtonText} size="full" variant="primary" />
      </div>
    </Container>
  );
};

export default PaymentRequestor;