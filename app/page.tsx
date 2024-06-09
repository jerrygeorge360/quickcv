import {Input, TextArea} from '@/components/forms/inputs';
import { fields } from './fields';
import { LinkFields } from './clients/Extrafields';
import { PdfSection } from './clients/PdfSection';



export default function Home() {
  return (
    <main className="flex min-h-screen  justify-between px-4 py-20 gap-4 h-content pb-4">
      <div className='w-1/2 h-full'>
        {/* a form that ask for name, gender date of birth , occupation, role, and social hanlde  */}
        <form className="flex flex-col items-center justify-center space-y-4 w-full">
          {
            fields.map((field, index) => {
              return field?.type !== 'textarea' ? <Input key={index} {...field} /> : <TextArea key={index} {...field} />
            })
          }
          <LinkFields />
        </form>
      </div>
      {/* the output tab with bg color white */}
      <PdfSection>
        # Heading One (H1)
      </PdfSection>
      
    </main>
  );
}