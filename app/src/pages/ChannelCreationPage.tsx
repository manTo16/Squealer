import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Collapse, FloatingLabel, Form } from 'react-bootstrap';
import UserSelector from "@components/UserSelector";
import { UserContext } from '@utils/userData';
import axios from '@root/axiosConfig';
import { channelsURL } from '../URLs';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const normalChannelRegex = /^([a-z0-9]+)$/;

export default function ChannelCreationPage() {
  const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext)
  const userToken = localStorage.getItem("token") ?? "";

  const navigate = useNavigate()

  const [channelName, setChannelName] = useState("");
  const [showSyntaxWarning, setShowSyntaxWarning] = useState(false);
  const [canWrite, setCanWrite] = useState(true);
  const [canRead, setCanRead] = useState(true);

  const [writers, setWriters] = useState<string[]>([])
  const [readers, setReaders] = useState<string[]>([])
  const [owners, setOwners] = useState<string[]>([])

  const [channelAlreadyTakenAlert, setChannelAlreadyTakenAlert] = useState(false)

  function removeDuplicates(array: string[]): string[] {
    return array.filter((value, index, self) => self.indexOf(value) === index);
  }

  function setWritersNoDuplicates(array: string[]): void {
    setWriters(removeDuplicates(array))
  }
  function setReadersNoDuplicates(array: string[]): void {
    setReaders(removeDuplicates(array))
  }
  function setOwnersNoDuplicates(array: string[]): void {
    setOwners(removeDuplicates(array))
  }

  const checkChannelNameSyntax = () => {
    return normalChannelRegex.test(channelName);
  };

  useEffect(() => {
    setShowSyntaxWarning(!!channelName && !checkChannelNameSyntax());
  }, [channelName]);

  const handleSubmit = () => {
    let submitWriters = []
    let submitReaders = []
    if (!canWrite) submitWriters = [...writers, userDetails.username]
    else submitWriters = writers
    if (!canRead) submitReaders = [...readers, userDetails.username]
    else submitReaders = readers
    const submitOwners = [...owners, userDetails.username]

    
    axios.post(channelsURL+"/", 
    {
        channelName: channelName,
        username: userDetails.username,
        owners: submitOwners,
        writers: submitWriters,
        readers: submitReaders,
        reserved: false
    },
    { headers: {"Authorization": `Bearer ${userToken}`}})
    .catch((error) =>{
        if (error instanceof Error && 'response' in error) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 409) {
              console.log("ChannelCreationPage handleSubmit 409 channelName: ", channelName);
              setChannelAlreadyTakenAlert(true)
            } else {
              throw error;
            }
          }
        })
    .then(() => {
        navigate("/")
    })
  }

  return (
    <>
      <h1>Crea un nuovo canale!</h1>
      
      {channelAlreadyTakenAlert &&
      <Alert variant="danger" onClose={() => setChannelAlreadyTakenAlert(false)} dismissible>
      Nome già in uso
      </Alert>
      }
      <Collapse in={showSyntaxWarning}>
        <div>
          <p className="text-danger">I canali possono contenere solo lettere minuscole e numeri</p>
        </div>
      </Collapse>
      <FloatingLabel controlId="floatingChannelNameId" label="Nome Canale" className="text-secondary">
        <Form.Control type="text" placeholder="Nome canale" autoFocus onChange={(e) => setChannelName(e.target.value)} isInvalid={showSyntaxWarning} />
      </FloatingLabel>

      <p className='mt-3'>Aggiungi amministratori del canale</p>
      <UserSelector buttons={owners} setButtons={setOwnersNoDuplicates} />

      <Form.Check 
        type="checkbox"
        label="Tutti possono scrivere"
        onChange={(e) => setCanWrite(e.target.checked)}
        defaultChecked={canWrite}
      />
      <Collapse in={!canWrite}>
        <div>
          <UserSelector placeholderText='Chi può scrivere?' buttons={writers} setButtons={setWritersNoDuplicates} />
        </div>
      </Collapse>

      <Form.Check 
        type="checkbox"
        label="Tutti possono leggere"
        defaultChecked={canRead}
        onChange={(e) => setCanRead(e.target.checked)}
      />
      <Collapse in={!canRead}>
        <div>
          <UserSelector placeholderText='Chi può leggere?' buttons={readers} setButtons={setReadersNoDuplicates} />
        </div>
      </Collapse>

      <Button disabled={!channelName || showSyntaxWarning} onClick={() => handleSubmit()}>
        Crea canale
      </Button>
    </>
  );
}