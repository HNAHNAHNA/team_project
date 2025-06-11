import { useNavigate } from "react-router-dom";

function EditUserInfo() {
  const navigate = useNavigate();

  return (
    <section className="max-w-[1100px] m-auto mt-5">
      <div className="p-3 bg-white rounded-md shadow-md my-2">
        <table className="sm:w-8/12 w-11/12 m-auto text-left text-sm">
          <tbody>
            <tr className="h-[60px] w-full">
              <th className="p-3 bg-neutral-100 sm:text-sm text-xs font-semibold sm:w-4/12 w-5/12">
                아이디
              </th>
              <td className="py-3 w-8/12">
                <input
                  className="bg-gray-300 my-2 mx-2 sm:w-[350px] w-[150px] rounded-md border border-gray-200 border-t-[3px] h-[45px] p-3"
                  type="text"
                  value="sampleId"
                  readOnly
                />
              </td>
            </tr>

            <tr className="border-t-[1px] h-[160px] w-full">
              <th className="p-3 bg-neutral-100 sm:text-sm text-xs font-semibold sm:w-4/12 w-5/12">
                이미지
              </th>
              <td className="py-3 w-8/12">
                {/* 이미지 컴포넌트 자리 */}
                <div className="w-24 h-24 bg-gray-200 rounded-full" />
              </td>
            </tr>

            <tr className="border-t-[1px] h-[60px] w-full">
              <th className="p-3 bg-neutral-100 sm:text-sm text-xs font-semibold sm:w-4/12 w-5/12">
                사용자명
              </th>
              <td className="py-3 w-8/12">
                <input
                  className="my-2 mx-2 sm:w-[350px] w-[150px] rounded-md border border-gray-200 border-t-[3px] h-[45px] p-3"
                  type="text"
                  value="홍길동"
                />
              </td>
            </tr>

            <tr className="border-t-[1px] h-[60px] w-full">
              <th className="p-3 bg-neutral-100 sm:text-sm text-xs font-semibold sm:w-4/12 w-5/12">
                비밀번호변경
              </th>
              <td className="py-3 w-8/12">
                <input
                  className="my-2 mx-2 sm:w-[350px] w-[150px] rounded-md border border-gray-200 border-t-[3px] h-[45px] p-3"
                  type="password"
                  value=""
                />
                <p className="pl-3 text-gray-600 font-sans text-xs font-bold">
                  비밀번호 변경을 원하시면 입력해주세요
                </p>
              </td>
            </tr>

            <tr className="border-t-[1px] h-[60px] w-full">
              <th className="p-3 bg-neutral-100 sm:text-sm text-xs font-semibold sm:w-4/12 w-5/12">
                비밀번호확인
              </th>
              <td className="py-3 w-8/12">
                <input
                  className="my-2 mx-2 sm:w-[350px] w-[150px] rounded-md border border-gray-200 border-t-[3px] h-[45px] p-3"
                  type="password"
                  value=""
                />
              </td>
            </tr>

            <tr className="border-t-[1px] h-[60px] w-full">
              <th className="p-3 bg-neutral-100 sm:text-sm text-xs font-semibold sm:w-4/12 w-5/12">
                휴대폰번호
              </th>
              <td className="py-3 w-8/12">
                <input
                  className="my-2 mx-2 sm:w-[350px] w-[150px] rounded-md border border-gray-200 border-t-[3px] h-[45px] p-3"
                  type="text"
                  value="010-1234-5678"
                />
              </td>
            </tr>

            <tr className="border-t-[1px] h-[60px] w-full">
              <th className="p-3 bg-neutral-100 sm:text-sm text-xs font-semibold sm:w-4/12 w-5/12">
                이메일
              </th>
              <td className="py-3 w-8/12">
                <input
                  className="my-2 mx-2 sm:w-[350px] w-[150px] rounded-md border border-gray-200 border-t-[3px] h-[45px] p-3"
                  type="text"
                  value="user@example.com"
                />
              </td>
            </tr>

            <tr>
              <td className="flex gap-2 mt-2 text-center">
                <button
                  className="sm:w-6/12 w-5/12 bg-blue-500 h-[45px] text-white sm:font-bold font-semibold sm:text-sm text-[10px] py-2 px-2 rounded-md hover:bg-blue-600"
                >
                  수정
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="sm:w-6/12 w-5/12 bg-blue-500 h-[45px] text-white sm:font-bold font-semibold sm:text-sm text-[10px] py-2 px-2 rounded-md hover:bg-blue-600"
                >
                  HOME
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default EditUserInfo