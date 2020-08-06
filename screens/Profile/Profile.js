import * as firebase from "firebase";
import React, { Component } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import {
  setViewingRecipe,
  setUserID,
  setViewingRecipeStep,
  setTabsShowing,
} from "../../util/app-redux";

const window = Dimensions.get("window");

const mapStateToProps = (state) => {
  return {
    userID: state.userID,
    viewingRecipe: state.viewingRecipe,
    viewingRecipeStep: state.viewingRecipeStep,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserID: (userID) => {
      dispatch(setUserID(userID));
    },
    setViewingRecipe: (recipeID) => {
      dispatch(setViewingRecipe(recipeID));
    },
    setViewingRecipeStep: (stepNum) => {
      dispatch(setViewingRecipeStep(stepNum));
    },
    setTabsShowing: (showing) => {
      dispatch(setTabsShowing(showing));
    },
  };
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: [],
      following: [],
      posts: [],
      username: props.userID,
      loaded: false,
    };
  }

  async componentDidMount() {
    const firestore = firebase.firestore();
    const userDocument = await firestore.collection("users").doc("admin").get();

    const posts = firestore.collection("posts");
    var userPosts = [];
    // Horribly inefficient, but did not find a method that returns multiple docs at once

    for (const postId of userDocument.get("posts")) {
      const post = await posts.doc(postId).get();

      userPosts.push({
        comments: post.get("comments"),
        likes: post.get("likes"),
        recipeID: post.get("recipeID"),
      });
    }

    this.setState({
      followers: userDocument.get("followers"),
      following: userDocument.get("following"),
      posts: userPosts,
      loaded: true,
    });
  }

  render() {
    if (this.state.loaded)
      return (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>{this.state.username}</Text>

          <React.Fragment>
            {this.state.posts.map((post) => (
              <Button
                onPress={() => {
                  this.props.setViewingRecipe(post.recipeID);
                  this.props.setViewingRecipeStep(1);
                  this.props.navigation.navigate("Recipe");
                  this.props.setTabsShowing(false);
                }}
                key={post.recipeID}
                title={"View Recipe " + post.recipeID}
                color="#841584"
              ></Button>
            ))}
          </React.Fragment>
        </SafeAreaView>
      );
    else
      return (
        <SafeAreaView
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: window.width,
            height: window.height - 120,
          }}
        >
          <ActivityIndicator size="small" color="grey" />
        </SafeAreaView>
      );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
