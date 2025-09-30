interface HeaderProps {
  title: string;
  userName?: string;
}

export default function Header({ title, userName }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-medium text-gray-900">{title}</h1>
              </div>
            </div>
          </div>
          {userName && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-700 font-medium">{userName} さん</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}