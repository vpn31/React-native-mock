import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Card1 from './components/card1';
import { LoremIpsum } from 'lorem-ipsum';
import hello from './assets/hello.jpg';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [user, setUser] = useState(null);

  const lorem=new LoremIpsum({
    sentencesPerParagraph: {
      max:8,
      min:4
    },
    wordsPerSentence: {
      max:16,
      min:4
    }
  })

  const [request, response, prompt] = Google.useAuthRequest(
    {
      expoClientId:"228944311807-mo9v2mdtr048c50ntlai1fuc2c83cm6v.apps.googleusercontent.com",
      webClientId: '228944311807-04i7qid5234q9e005karcrbscqp1v50c.apps.googleusercontent.com',
      androidClientId: '228944311807-s44f3jmphsfc2nuu3kgkcnu23aoq52qn.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      })
        .then((response) => response.json())
        .then((userInfo) => {
          setUser(userInfo);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      prompt();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const content="The quick brown fox jumps over the lazy dogs.";

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Demo App
      </Text>
      <Card1 title={'Hello Guest'} content={content} imageSource={hello}/>
      {user ? (
        <View style={styles.container2}>
          <Card1 title={`Hello ${user.given_name}`} content={content} imageSource={hello}/>
          <Button title="Logout" style={styles.button} onPress={handleLogout}/>
        </View>
      ) : (
        <Button title="Login with Google" onPress={handleLogin} styles={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  container2: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    marginTop:90,
    fontSize:30,
    fontWeight:'bold',
  },
  image: {
    padding:50,
    paddingTop:50,
    width:400
  }
});

