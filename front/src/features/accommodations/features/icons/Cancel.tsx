import CloseIcon from './images/close-round-line-icon.svg?react'

type CancelProps = {
  className?:string
}

function Cancel({ className = ''}: CancelProps) {
  return (
    <div className={`inline-block bg-gray-300 rounded-full hover:shadow-xl hover:bg-white hover:cursor-pointer ${className}`}>
      <CloseIcon className='w-7 h-7 text-black' />
    </div>
  );
}

export default Cancel
