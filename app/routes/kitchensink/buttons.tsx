/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ContentContainer } from "~/components";
import CloseIcon from "~/components/icons/mui/Close";

export default function KitchenSinkButtons() {
  const buttonSizes = ["large", "medium", "small"];
  return (
    <ContentContainer>
      <div className="grid md:grid-cols-4 gap-4">
        <div>Buttons</div>
        <div>
          <pre>size="large" (default)</pre>
        </div>
        <div>
          <pre>size="medium"</pre>
        </div>
        <div>
          <pre>size="small"</pre>
        </div>
        <div>primary</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button size={size}>Button</Button>
          </div>
        ))}
        <div>primary with icon</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button size={size} icon={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
        <div>primary with iconRight</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button size={size} iconRight={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
        <div>primary with icon w/o text</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button size={size} icon={<CloseIcon />} />
          </div>
        ))}
        <div>primary disabled</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button disabled size={size} icon={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
        <div>secondary</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="secondary" size={size}>
              Button
            </Button>
          </div>
        ))}
        <div>secondary with icon</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="secondary" size={size} icon={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
        <div>secondary with iconRight</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="secondary" size={size} iconRight={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
        <div>secondary with icon w/o text</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="secondary" size={size} icon={<CloseIcon />} />
          </div>
        ))}
        <div>secondary disabled</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button disabled look="secondary" size={size} icon={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
        <div>tertiary</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="tertiary" size={size}>
              Button
            </Button>
          </div>
        ))}
        <div>tertiary with icon</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="tertiary" size={size} icon={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
        <div>tertiary with iconRight</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="tertiary" size={size} iconRight={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
        <div>tertiary with icon w/o text</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="tertiary" size={size} icon={<CloseIcon />} />
          </div>
        ))}
        <div>tertiary disabled</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button disabled look="tertiary" size={size} icon={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
        <div>ghost</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="ghost" size={size}>
              Button
            </Button>
          </div>
        ))}
        <div>ghost with icon</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="ghost" size={size} icon={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
        <div>ghost with iconRight</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="ghost" size={size} iconRight={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
        <div>ghost with icon w/o text</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button look="ghost" size={size} icon={<CloseIcon />} />
          </div>
        ))}
        <div>ghost disabled</div>
        {buttonSizes.map((size: any) => (
          <div>
            <Button disabled look="ghost" size={size} icon={<CloseIcon />}>
              Button
            </Button>
          </div>
        ))}
      </div>
      <Button size="medium" to="/" className="mb-4">
        Button is a Remix Link
      </Button>
      <br />
      <Button size="medium" to="/" className="mb-4" disabled>
        Button is a disabled Remix Link
      </Button>
      <br />
      <Button size="small" disabled icon={<CloseIcon />} className="mb-4">
        Button is a button
      </Button>
      <br />
      <Button
        look="secondary"
        href="https://digitalservice.bund.de"
        iconRight={<CloseIcon />}
        className="mb-4"
      >
        Button is a normal link
      </Button>
      <br />
      <Button look="tertiary" icon={<CloseIcon />} className="mb-4" />
      <br />
      <Button
        size="small"
        look="ghost"
        iconRight={<CloseIcon />}
        className="mb-4"
      >
        Ghost button
      </Button>
    </ContentContainer>
  );
}
