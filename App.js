import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { DirectLine } from "botframework-directlinejs";
const directLine = new DirectLine({
  secret: "KD5AAPQeTrI.c_5h0YHGQn-RZWPfr8k9WxSNMGi7JyNPrjCfZR789-I"
});
const botMessageToGiftedMessage = botMessage => {
  return {
    ...botMessage,
    _id: botMessage.id,
    createdAt: botMessage.timestamp,
    user: {
      _id: 2,
      name: "React Native",
      avatar:
        "https://cdn-icons-png.flaticon.com/512/4711/4711987.png"
    },
  }
};
function giftedMessageToBotMessage(message) {
  return {
    from: { id: 1, name: "John Doe" },
    type: "message",
    text: message.text
  };
}
export default class App extends React.Component {
  state = {
    messages: []
  };
constructor(props) {
    super(props);
    directLine.activity$.subscribe(botMessage => {
      const newMessage = botMessageToGiftedMessage(botMessage);
      this.setState({ messages: [newMessage, ...this.state.messages] });
    });
  }
onSend = messages => {
    this.setState({ messages: [...messages, ...this.state.messages] });

    messages.forEach(message => {
      directLine
        .postActivity(giftedMessageToBotMessage(message))
        .subscribe(() => console.log("success"), () => console.log("failed"));
    });
  };
render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          user={{
            _id: 1
          }}
          messages={this.state.messages}
          onSend={this.onSend}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});