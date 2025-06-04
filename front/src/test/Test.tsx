
function Test () {
  const randomPrice = () => {
    return Math.floor((Math.random()) * 300) + 1
  }


  return (
    <div>
      {randomPrice()}
    </div>
  )
}

export default Test