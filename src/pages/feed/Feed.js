import React, { Component } from "react";
import io from "socket.io-client";
import api from "../../services/api";

import "./Feed.css";

import more from "../../assets/more.svg";
import like from "../../assets/like.svg";
import comment from "../../assets/comment.svg";
import send from "../../assets/send.svg";

class Feed extends Component {
  state = {
    feed: []
  };

  handleLike = async e => {
    await api.post(`posts/${e}/like`);
  };

  async componentDidMount() {
    this.realTime();
    const { data } = await api.get("posts");
    this.setState({ feed: data });
  }

  realTime = () => {
    const socket = io.connect("http://localhost:3001");
    socket.on("post", post => {
      this.setState({ feed: [post, ...this.state.feed] });
    });
    socket.on("like", like => {
      this.setState({
        feed: this.state.feed.map(post => (post._id === like._id ? like : post))
      });
    });
  };

  render() {
    const { feed } = this.state;
    return (
      <section id="post-list">
        {feed.map(post => (
          <article key={post._id}>
            <header>
              <div className="user-info">
                <span>{post.author}</span>
                <span className="place">{post.place}</span>
              </div>
              <img src={more} alt="Mais" />
            </header>
            <img src={`http://localhost:3001/files/${post.image}`} alt="" />
            <footer>
              <div className="actions">
                <button type="button" onClick={() => this.handleLike(post._id)}>
                  <img src={like} alt="like" />
                </button>
                <img src={comment} alt="comment" />
                <img src={send} alt="send" />
              </div>
              <strong>{post.likes} curtidas</strong>
              <p>
                {post.description}
                <span>{post.hashtags}</span>
              </p>
            </footer>
          </article>
        ))}
      </section>
    );
  }
}

export default Feed;
