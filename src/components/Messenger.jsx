function Messenger({ toggler }) {
  return (
    <div className='messenger-container'>
      <button className='button-close' onClick={toggler}>
        X
      </button>
      <p>THIS IS THE MESSENGER</p>
      <style>
        {
          /* CSS */ `.messenger-container{
            position: absolute;
            margin: 2rem;
            width: clamp(20rem, 80%, 25rem);
            background-color: var(--color-neutral);
            
            aspect-ratio: 1;
            z-index: 50000;
            top: 0;
            right: 3rem;
            color: white;
            font-size: x-large;

            --width-close-button: 5rem;

            .button-close {
              position: absolute;
              width: var(--width-close-button);
              top: calc(-1 * var(--width-close-button) / 2 + 1rem);
              right: calc(-1 * var(--width-close-button) / 2 + 1rem);
              padding: 1rem;
              aspect-ratio: 1;

              border: none;
              border-radius: 50%;
              background-color: var(--color-background-secondary-off);

              &:hover {
                background-color: hsl(
                  from var(--color-background-secondary) h s calc(l - 5)
                ));
                color: var(--color-highlight);
              }
            }
        }`
        }
      </style>
    </div>
  )
}

export default Messenger
