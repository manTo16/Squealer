import { useEffect, useState } from 'react';
import { Button, Collapse, FloatingLabel, Form } from 'react-bootstrap';
import UserSelector from "@components/UserSelector";

const normalChannelRegex = /^([a-z0-9]+)$/;

export default function ChannelCreationPage() {
  const [channelName, setChannelName] = useState("");
  const [showSyntaxWarning, setShowSyntaxWarning] = useState(false);
  const [canWrite, setCanWrite] = useState(false);
  const [canRead, setCanRead] = useState(false);

  const checkChannelNameSyntax = () => {
    return normalChannelRegex.test(channelName);
  };

  useEffect(() => {
    setShowSyntaxWarning(!!channelName && !checkChannelNameSyntax());
  }, [channelName]);

  return (
    <>
      <h1>Crea un nuovo canale!</h1>

      <Collapse in={showSyntaxWarning}>
        <div>
          <p className="text-danger">I canali possono contenere solo lettere minuscole e numeri</p>
        </div>
      </Collapse>
      <FloatingLabel controlId="floatingChannelNameId" label="Nome Canale" className="text-secondary">
        <Form.Control type="text" placeholder="Nome canale" autoFocus onChange={(e) => setChannelName(e.target.value)} isInvalid={showSyntaxWarning} />
      </FloatingLabel>

      <p className='mt-3'>Aggiungi amministratori del canale</p>
      <UserSelector />

      <Form.Check 
        type="checkbox"
        label="Tutti possono scrivere"
        onChange={(e) => setCanWrite(e.target.checked)}
      />
      <Collapse in={!canWrite}>
        <div>
          <UserSelector placeholderText='Chi può scrivere?' />
        </div>
      </Collapse>

      <Form.Check 
        type="checkbox"
        label="Tutti possono leggere"
        onChange={(e) => setCanRead(e.target.checked)}
      />
      <Collapse in={!canRead}>
        <div>
          <UserSelector placeholderText='Chi può leggere?' />
        </div>
      </Collapse>

      <Button disabled={!channelName || showSyntaxWarning}>
        Crea canale
      </Button>
    </>
  );
}