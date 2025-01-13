import React, { useContext, useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseAPIURL } from "../App";
import { ClassifaiContext } from "../context/classifai_context";
const getPartyID = () => {
  const url = window.location.pathname;
  const partyId = url.split("/");
  return partyId[partyId.length - 1];
};
const MultiplayerGamePage: React.FC = () => {
  const [imgList, setImgList] = useState<
    { source: string; isPanier: boolean }[]
  >([]);
  useEffect(() => {
    async function getImgList() {
      const partie = await axios.get(`${baseAPIURL}/partie/${getPartyID()}`);
      const ol = await axios.get(`${baseAPIURL}/images/${partie.data.seed}`);
      setImgList(ol.data);
    }
    getImgList();
  }, []);

  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [source, setSource] = useState("");
  const [stillAlive, setStillAlive] = useState(true);
  const [isPanier, setIsPanier] = useState(false);

  const [parcourreur, setParcourreur] = useState(0);
  const [wootwoot, setWootwoot] = useState(false);
  const { user, setUser } = useContext(ClassifaiContext);
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime >= 300) {
          clearInterval(intervalId);
          setStillAlive(false);
          return prevTime;
        }
        return prevTime + 1;
      });
    }, 10);
    return () => clearInterval(intervalId);
  }, [stillAlive]);

  async function handleRestart() {
    try {
      const img = await axios.get(`${baseAPIURL}/image`);
      setIsPanier(img.data.isPanier);
      setSource(img.data.source);
      setTimer(0);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
    setScore(0);
    setStillAlive(true);
    setWootwoot(false);
  }
  async function handleClick(clickPanier: Boolean) {
    if (clickPanier === isPanier && stillAlive) {
      setScore((timer < 50 ? 1000 : 1000 * ((300 - timer) / 250)) + score);
      setTimer(0);
      try {
        if (parcourreur + 1 < imgList.length) {
          setIsPanier(imgList[parcourreur + 1].isPanier);
          setSource(imgList[parcourreur + 1].source);
          setParcourreur(parcourreur + 1);
        } else {
          console.log("tutu");
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    } else {
      setStillAlive(false);
      if (user && user.scoreMax < score) {
        setWootwoot(true);
        await axios.put(`${baseAPIURL}/userScore`, {
          id: user.id,
          scoreMax: score,
        });
        setUser({
          id: user.id,
          motdepasse: user.motdepasse,
          scoreMax: score,
          username: user.username,
          email: user.email,
        });
      }
    }
  }
  useEffect(() => {
    async function fetchImages() {
      try {
        setImgList(
          (await axios.get(`${baseAPIURL}/images`)).data as {
            source: string;
            isPanier: boolean;
          }[]
        );
        setIsPanier(imgList[0].isPanier);
        setSource(imgList[0].source);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }
    fetchImages();
  }, []);
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Box display="flex" justifyContent="space-between" width="100%" px={3}>
        <Button variant="outlined" onClick={() => navigate("/menu")}>
          Quitter
        </Button>
      </Box>
      {stillAlive ? (
        <>
          <div style={{ display: "flex" }}>
            <h1 style={{ marginRight: 10 }}>{`Score: ${score}`}</h1>
            <h1 style={{ marginLeft: 10 }}>
              timer:
              {timer < 200
                ? `${(300 - timer).toString().slice(0, 1)}.${(300 - timer)
                    .toString()
                    .slice(1, 3)}`
                : `0.${(300 - timer).toString()}`}
            </h1>
          </div>
          <img height={200} width={200} src={`/img/${source}`} />
          <div>
            <Button
              variant="contained"
              onClick={() => {
                handleClick(true);
              }}
            >
              Panier
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleClick(false);
              }}
            >
              Piano
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: 96, color: "#FF0000" }}>Game over</h1>
          {wootwoot && <h1> Nouveau record</h1>}
          <h1>{`Score: ${score}`}</h1>
          <Button variant="contained" onClick={handleRestart}>
            Restart
          </Button>
        </>
      )}
    </Box>
  );
};

export default MultiplayerGamePage;
