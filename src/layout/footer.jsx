import '../assets/styles/footer.styl'

export default {
  data() {
    return {
      author: 'ZhouJie',
    }
  },
  render() {
    return (
      <div id="footer">
        <span>Written By { this.author }</span>
      </div>
    );
  }
}