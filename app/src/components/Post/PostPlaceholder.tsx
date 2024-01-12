import { Placeholder } from "react-bootstrap";


export default function PostPlaceholder() {
    return (
        <div className="postPlaceholder">
          <Placeholder as="p" animation="glow">
            <Placeholder xs={{span: 3, offset: 3}} />
          </Placeholder>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={7} />
          </Placeholder>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
        </div>
      );
}